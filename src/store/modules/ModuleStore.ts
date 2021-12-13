import Vue from "vue";

import {
  Module,
  VuexModule,
  Mutation,
  MutationAction,
  Action,
} from "vuex-module-decorators";
import IModule from "@/models/module";
import store from "@/store";
import Stomp from "stompjs";
import ElectionStructureElement from "@/models/electionStructureElement";
import ElectionTansfer from "@/models/electionTransfer";
import ModuleCategory from "@/models/moduleCategory";
import ElectionStatus from "@/models/electionStatus";
import SockJS from "sockjs-client";
interface ModuleWrapper {
  moduleArr: Array<IModule>;
}

@Module({ store, dynamic: true, name: "moduleStore" })
export default class ModuleStore extends VuexModule {
  moduleArr: Array<IModule> = [];
  electedModules: Array<ElectionStructureElement> = [];
  overflowedElectedModules: Array<ElectionStructureElement> = [];
  isElectionValid = false;
  electionStatus: ElectionStatus = <ElectionStatus>{};
  client: Stomp.Client | null = null;

  @Mutation
  addModules(arr: Array<IModule>): void {
    this.moduleArr.push(...arr);
  }

  @Action
  async updateElection(moduleNo: string): Promise<void> {
    if (this.client && this.client.connected) {
      this.client.send("/app/save", {}, moduleNo);
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

  @Mutation
  createConnection(callback: (message: Stomp.Message) => void): void {
    const socket: WebSocket = new SockJS("/api/stomp-ws-endpoint");
    const stomp: Stomp.Client = Stomp.over(socket);
    stomp.connect({}, () => {
      stomp.subscribe("/user/queue/electionSaveStatus", callback);
    });
    this.client = stomp;
  }

  @MutationAction
  async updateModules(): Promise<ModuleWrapper> {
    const moduleArr: Array<IModule> = (
      await Vue.axios.get<Array<IModule>>("modules")
    ).data;
    localStorage.setItem("modules", JSON.stringify(moduleArr));
    return { moduleArr };
  }

  @Mutation
  updateElectionStatus(status: boolean): void {
    this.isElectionValid = status;
  }

  @Action
  async initModuleSelection(isStudent: boolean): Promise<void> {
    if (isStudent) {
      const electionData: ElectionTansfer = (
        await Vue.axios.get<ElectionTansfer>("/elections/structure")
      ).data;

      this.context.commit("setElectionData", electionData);
    }
  }

  get getModules(): Array<IModule> {
    return this.moduleArr;
  }

  get getElectedModules(): Array<ElectionStructureElement> {
    return this.electedModules;
  }

  get getOverflowedModules(): Array<ElectionStructureElement> {
    return this.overflowedElectedModules;
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
          color = "is-info";
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
    return this.client !== null && this.client.connected;
  }

  get isModuleSelected() {
    return (moduleNo: string): boolean => {
      let isElected = false;
      if (
        (this.electedModules &&
          this.electedModules.find(
            (element: ElectionStructureElement) => element.id === moduleNo
          )) ||
        (this.overflowedElectedModules &&
          this.overflowedElectedModules.find(
            (element: ElectionStructureElement) => element.id === moduleNo
          ))
      ) {
        isElected = true;
      }
      return isElected;
    };
  }
}
