import Vue from "vue";

import {
  Module,
  VuexModule,
  Mutation,
  MutationAction,
} from "vuex-module-decorators";
import { ModuleList } from "@/models/moduleList";
import { generateFillerList } from "@/tools/listGenerator";
import IModule from "@/models/module";
import store from "@/store";
import Stomp from "stompjs";
import ModuleElection from "@/models/moduleElection";
import { AxiosResponse } from "axios";
interface ModuleWrapper {
  moduleArr: Array<IModule>;
}

@Module({ store, dynamic: true, name: "moduleStore" })
export default class ModuleStore extends VuexModule {
  moduleArr: Array<IModule> = getModulesFromStorage();
  mySelection: ModuleList = generateFillerList();
  isElectionValid = false;
  client: Stomp.Client | null = null;

  @Mutation
  addModules(arr: Array<IModule>): void {
    this.moduleArr.push(...arr);
  }

  @Mutation
  saveToMySelection(moduleId: string): void {
    const module: IModule | undefined = findModuleById(
      this.moduleArr,
      moduleId
    );
    if (this.mySelection && module) {
      this.mySelection.replaceModule(module.category, module);
      if (this.client && this.client.connected) {
        this.client.send(
          "/app/save",
          {},
          JSON.stringify(this.mySelection.export())
        );
      }
    }
  }

  @Mutation
  removeFromMySelection(moduleId: string): void {
    const module: IModule | undefined = findModuleById(
      this.moduleArr,
      moduleId
    );
    if (this.mySelection && module) {
      this.mySelection.removeModule(module);
      if (this.client && this.client.connected) {
        this.client.send(
          "/app/save",
          {},
          JSON.stringify(this.mySelection.export())
        );
      }
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
  updateModuleSelection(): void {
    const mySelection: ModuleList = generateFillerList();
    Vue.axios
      .get<ModuleElection>("/election")
      .then((resp: AxiosResponse<ModuleElection>) => {
        const election: ModuleElection = resp.data;
        const electedModules: Array<string> = election.electedModules.concat(
          election.overflowedElectedModules
        );
        for (const moduleName of electedModules) {
          const module: IModule | undefined = findModuleById(
            this.moduleArr,
            moduleName
          );
          if (module) {
            mySelection.replaceModule(module.category, module);
          }
        }
        this.isElectionValid = election.electionValid;
        this.mySelection = mySelection;
      });
  }

  @Mutation
  updateElectionStatus(status: boolean): void {
    this.isElectionValid = status;
  }

  get getModules(): Array<IModule> {
    return this.moduleArr;
  }

  get getModuleList(): ModuleList {
    return this.mySelection;
  }

  get isStoreUninitialized(): boolean {
    return this.moduleArr.length == 0;
  }

  get isClientConnected(): boolean {
    return this.client !== null && this.client.connected;
  }
}

function findModuleById(
  modules: Array<IModule>,
  moduleId: string
): IModule | undefined {
  return modules.find((module: IModule) => module.module_no === moduleId);
}

function getModulesFromStorage(): Array<IModule> {
  const savedModules = localStorage.getItem("modules");
  let module: Array<IModule> = [];
  if (savedModules) {
    module = <Array<IModule>>JSON.parse(savedModules);
  }
  return module;
}
