import Vue from "vue";

import { Module, VuexModule, Mutation, MutationAction } from "vuex-module-decorators";
import { ModuleList } from "@/models/moduleList";
import { generateFillerList } from "@/tools/listGenerator";
import IModule from "@/models/module";
import store from "@/store";

interface ModuleWrapper {
  moduleArr: Array<IModule>;
}

@Module({ store, dynamic: true, name: "moduleStore" })
export default class ModuleStore extends VuexModule {
  moduleArr: Array<IModule> = [];
  mySelection: ModuleList | null = generateFillerList();

  @Mutation
  addModules(arr: Array<IModule>): void {
    this.moduleArr.push(...arr);
  }

  @Mutation
  saveToMySelection(moduleId: string): void {
    const module: IModule | undefined = findModuleById(this.moduleArr, moduleId);
    if (this.mySelection && module) {
      this.mySelection.replaceModule(module.category, module);
    }
  }

  @Mutation
  removeFromMySelection(moduleId: string): void {
    const module: IModule | undefined = findModuleById(this.moduleArr, moduleId);
    if (this.mySelection && module) {
      this.mySelection.removeModule(module);
    }
  }

  @MutationAction
  async updateModules(): Promise<ModuleWrapper> {
    const moduleArr: Array<IModule> = (await Vue.axios.get<Array<IModule>>("module")).data;
    return { moduleArr };
  }

  get getModules(): Array<IModule> {
    return this.moduleArr;
  }

  get isStoreUninitialized(): boolean {
    return this.moduleArr.length == 0;
  }
}

function findModuleById(modules: Array<IModule>, moduleId: string): IModule | undefined {
  return modules.find((module: IModule) => module.module_no === moduleId);
}
