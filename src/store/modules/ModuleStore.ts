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
interface ModuleWrapper {
  moduleArr: Array<IModule>;
}

@Module({ store, dynamic: true, name: "moduleStore" })
export default class ModuleStore extends VuexModule {
  moduleArr: Array<IModule> = getModulesFromStorage();
  electedModules: Array<ElectionStructureElement> = [];
  overflowedElectedModules: Array<ElectionStructureElement> = [];
  isElectionValid = false;
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
  }

  @Mutation
  setStompClient(client: Stomp.Client): void {
    this.client = client;
  }

  @MutationAction
  async updateModules(): Promise<ModuleWrapper> {
    const moduleArr: Array<IModule> = (
      await Vue.axios.get<Array<IModule>>("module")
    ).data;
    localStorage.setItem("modules", JSON.stringify(moduleArr));
    return { moduleArr };
  }

  @Mutation
  updateElectionStatus(status: boolean): void {
    this.isElectionValid = status;
  }

  @Action
  async initModuleSelection(): Promise<void> {
    const electionData: ElectionTansfer = (
      await Vue.axios.get<ElectionTansfer>("/election")
    ).data;

    this.context.commit("setElectionData", electionData);
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
}

function getModulesFromStorage(): Array<IModule> {
  const savedModules = localStorage.getItem("modules");
  let module: Array<IModule> = [];
  if (savedModules) {
    module = <Array<IModule>>JSON.parse(savedModules);
  }
  return module;
}
