import {
  Module,
  VuexModule,
  Mutation,
  Action,
  getModule,
  MutationAction,
} from "vuex-module-decorators";
import IModule from "@/models/module";
import store from "@/store";
import Stomp from "stompjs";
import ElectionStructureElement from "@/models/electionStructureElement";
import ElectionTansfer from "@/models/electionTransfer";
import ModuleCategory from "@/models/moduleCategory";
import ElectionStatus from "@/models/electionStatus";
import SockJS from "sockjs-client";
import ModuleElectionApi from "@/mixins/ModuleElectionApi";
import UserStore from "./UserStore";
import { NotificationProgrammatic as Notification } from "buefy";
import ModuleFilter from "@/models/moduleFilter";
import ModuleApi from "@/mixins/ModuleApi";
import _ from "lodash";

interface HeaderMessage {
  message: string;
}

@Module({ store, dynamic: true, name: "moduleStore" })
export default class ModuleStore extends VuexModule {
  moduleArr: Array<IModule> = [];
  filteredModules: Array<IModule> = [];
  electedModules: Array<ElectionStructureElement> = [];
  overflowedElectedModules: Array<ElectionStructureElement> = [];
  moduleFilters: Array<Partial<ModuleFilter>> = [{}];
  numberOfFilters = 1;
  isElectionValid = false;
  isFilterActive = false;
  electionStatus: ElectionStatus | null = null;
  client: Stomp.Client | null = null;

  @Mutation
  setModuleFilters(moduleFilters: Array<Partial<ModuleFilter>>): void {
    this.moduleFilters = moduleFilters;
  }

  @Mutation
  setNumberOfFilters(numberOfFilters: number): void {
    this.numberOfFilters = numberOfFilters;
  }

  @Mutation
  setFilteredModules(filteredModules: Array<IModule>): void {
    this.filteredModules = filteredModules;
  }

  @Mutation
  emptyFilteredModules(): void {
    this.filteredModules = [];
  }

  @Mutation
  setIsFilterActive(isFilterActive: boolean): void {
    this.isFilterActive = isFilterActive;
  }

  @Mutation
  updateElection(moduleNo: string): void {
    if (this.client && this.client.connected) {
      this.client.send("/app/save", {}, moduleNo);
    } else {
      Notification.open({
        message:
          "Es besteht keine Verbindung zum Backend, die Wahl wird nicht gespeichert",
        type: "is-warning",
        hasIcon: true,
        indefinite: true,
      });
    }
  }

  @Mutation
  setElectionData(electionData: ElectionTansfer): void {
    this.electedModules = electionData.electionStructure.electedModules;
    this.overflowedElectedModules =
      electionData.electionStructure.overflowedModules;
    this.isElectionValid = electionData.electionValid;
    this.electionStatus = electionData.electionStatusDTO;
  }

  @Mutation
  setStompClient(client: Stomp.Client): void {
    this.client = client;
  }

  @Action
  createConnection(): void {
    const socket: WebSocket = new SockJS("/api/stomp-ws-endpoint");
    const stomp: Stomp.Client = Stomp.over(socket);
    if (process.env.NODE_ENV === "production") {
      stomp.debug = () => null;
    }
    stomp.connect(
      {},
      () => {
        stomp.subscribe(
          "/user/queue/electionSaveStatus",
          (message: Stomp.Message) => this.updateElectionInformation(message)
        );
      },
      (error: Stomp.Frame | string) => this.handleWebsocketError(error)
    );
    this.context.commit("setStompClient", stomp);
  }

  @Action
  handleWebsocketError(error: Stomp.Frame | string): void {
    let message = "Es ist etwas schiefgelaufen";
    let showError = false;
    if (error instanceof Stomp.Frame && error.headers) {
      message = ((error as Stomp.Frame).headers as HeaderMessage).message;
      showError = true;
    }
    Notification.open({
      hasIcon: true,
      type: "is-warning",
      message: message,
      active: showError,
    });

    this.context.commit("closeStompConnection");
  }

  @Action
  updateElectionInformation(message: Stomp.Message): void {
    if (message.body && message.body !== null) {
      const electionData: ElectionTansfer = JSON.parse(message.body);
      this.context.commit("setElectionData", electionData);
      Notification.open({
        hasIcon: true,
        type: "is-success",
        ariaCloseLabel: "Benachrichtigung schliessen",
        message: "Ihre Modulvorwahl wurde erfolgreich gespeichert",
        icon: "check",
      });
      message.ack();
    }
  }

  @Mutation
  closeStompConnection(): void {
    if (this.client) {
      this.client.disconnect(() => null);
    }
  }

  @MutationAction
  async updateModules(): Promise<{ moduleArr: Array<IModule> }> {
    const moduleApi = new ModuleApi();
    const moduleArr: Array<IModule> = await moduleApi.getAll();
    return { moduleArr };
  }

  @Mutation
  updateElectionStatus(status: boolean): void {
    this.isElectionValid = status;
  }

  @Action
  async initModuleSelection(): Promise<void> {
    const userStore = getModule(UserStore);
    if (userStore.isStudent && userStore.student) {
      const api = new ModuleElectionApi();
      const electionData: ElectionTansfer = await api.getElectionStructure(
        userStore.student.email
      );
      this.context.commit("setElectionData", electionData);
    }
  }

  get getColorForCategory() {
    return (cat: ModuleCategory): string => {
      let color = "";
      switch (cat) {
        case ModuleCategory.INTERDISCIPLINARY_MODULE:
          color = "is-warning";
          break;
        case ModuleCategory.CONSECUTIVE_MODULE:
        case ModuleCategory.SUBJECT_MODULE:
          color = "is-electiveModule";
          break;
        case ModuleCategory.CONTEXT_MODULE:
          color = "is-contextModule";
          break;
        case ModuleCategory.PROJECT_MODULE:
        case ModuleCategory.BACHELOR_MODULE:
          color = "is-projectModule";
          break;
        case ModuleCategory.DISPENSED_PA_MODULE:
        case ModuleCategory.DISPENSED_WPM_MODULE:
          color = "is-dispensed";
          break;
      }
      return color;
    };
  }

  get findModuleById() {
    return (moduleId: string): IModule | undefined => {
      return this.moduleArr.find(
        (module: IModule) => module.moduleNo === moduleId
      );
    };
  }

  get isStoreUninitialized(): boolean {
    return this.moduleArr.length == 0;
  }

  get isClientConnected(): boolean {
    return _.get(this.client, "connected", false);
  }

  get isModuleSelected() {
    return (moduleNo: string): boolean =>
      this.findElectedModule(this.electedModules, moduleNo) ||
      this.findElectedModule(this.overflowedElectedModules, moduleNo);
  }

  get findElectedModule() {
    return (arr: Array<ElectionStructureElement>, moduleNo: string): boolean =>
      arr.find((structureElement) => structureElement.id === moduleNo)
        ? true
        : false;
  }
}
