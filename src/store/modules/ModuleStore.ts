import Vue from "vue";

import {
  Module,
  VuexModule,
  Mutation,
  MutationAction,
  Action,
} from "vuex-module-decorators";
import { ModuleList, Node } from "@/models/moduleList";
import IModule from "@/models/module";
import store from "@/store";
import Stomp from "stompjs";
interface ModuleWrapper {
  moduleArr: Array<IModule>;
}

interface Structure {
  [index: string]: Array<Node> | Array<IModule>;
}

@Module({ store, dynamic: true, name: "moduleStore" })
export default class ModuleStore extends VuexModule {
  moduleArr: Array<IModule> = getModulesFromStorage();
  mySelection: ModuleList | null = null;
  isElectionValid = false;
  client: Stomp.Client | null = null;

  @Mutation
  addModules(arr: Array<IModule>): void {
    this.moduleArr.push(...arr);
  }

  @Action
  saveToMySelection(moduleId: string): void {
    const module: IModule | undefined =
      this.context.getters["findModuleById"](moduleId);
    if (this.mySelection && module) {
      this.mySelection.replaceModule(module.category, module);
      this.context.commit("saveChanges");
    }
  }

  @Action
  removeFromMySelection(moduleId: string): void {
    const module: IModule | undefined =
      this.context.getters["findModuleById"](moduleId);
    if (this.mySelection && module) {
      this.mySelection.removeModule(module);
      this.context.commit("saveChanges");
    }
  }

  @Mutation
  saveChanges(): void {
    if (this.client && this.client.connected && this.mySelection) {
      this.client.send(
        "/app/save",
        {},
        JSON.stringify(this.mySelection.export())
      );
    }
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

  @Mutation
  setModuleSelection(selection: ModuleList): void {
    this.mySelection = selection;
  }

  @Action
  async initModuleSelection(): Promise<void> {
    const moduleList: ModuleList = new ModuleList();
    const moduleStructure: Structure = (
      await Vue.axios.get<Structure>("/election/structure")
    ).data;
    const electedModules: Array<Node> = <Array<Node>>(
      moduleStructure["electedModules"]
    );
    const overflowedElectedModules: Array<IModule> = <Array<IModule>>(
      moduleStructure["overflowedElectedModules"]
    );

    if (electedModules) {
      for (const node of electedModules) {
        moduleList.add(node);
      }
    }

    if (overflowedElectedModules) {
      moduleList.setOverflowedModules(overflowedElectedModules);
    }
    this.context.commit("setModuleSelection", moduleList);
  }

  get getModules(): Array<IModule> {
    return this.moduleArr;
  }

  get findModuleById() {
    return (moduleId: string): IModule | undefined => {
      return this.moduleArr.find(
        (module: IModule) => module.module_no === moduleId
      );
    };
  }

  get getModuleList(): ModuleList | null {
    return this.mySelection;
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
