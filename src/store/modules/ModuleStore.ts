import Vue from "vue";

import { Module, VuexModule, Mutation } from "vuex-module-decorators";
import { ModuleList } from "@/models/moduleList";
import { generateFillerList } from "@/tools/listGenerator";
import IModule from "@/models/module";
import store from "@/store";

@Module({ store, dynamic: true, name: "moduleStore" })
export default class ModuleStore extends VuexModule {
  moduleArr: Array<IModule> = [];
  mySelection: Array<string> = [];

  @Mutation
  initStore(): void {
    if (this.moduleArr.length == 0) {
      Vue.axios
        .get<IModule[]>("module")
        .then((resp) => {
          if (resp.data.length != 0) this.moduleArr.push(...resp.data);
        })
        .catch((err) => {
          Vue.swal({
            title: "Fehler beim Laden der Module",
            text: `Die Module konnten nicht geladen werden. ${err}`,
            icon: "error",
          });
        });
    }
  }
  mySelection: ModuleList | null = generateFillerList();

  @Mutation
  addModules(arr: Array<IModule>): void {
    this.moduleArr.push(...arr);
  }

  @Mutation
  saveToMySelection(moduleId: string): void {
    this.mySelection.push(moduleId);
    const module: IModule | undefined = findModuleById(this.moduleArr, moduleId);
    if (this.mySelection && module) {
      this.mySelection.replaceModule(module.category, module);
    }
  }

  @Mutation
  removeFromMySelection(moduleId: string): void {
    const index = this.mySelection.indexOf(moduleId, 0);
    if (index > -1) {
      this.mySelection.splice(index, 1);
    const module: IModule | undefined = findModuleById(this.moduleArr, moduleId);
    if (this.mySelection && module) {
      this.mySelection.removeModule(module);
    }
  }

  get getMySelection(): Array<string> {
    return this.mySelection;
  }

  get getModules(): Array<IModule> {
    return this.moduleArr;
  }

function findModuleById(modules: Array<IModule>, moduleId: string): IModule | undefined {
  return modules.find((module: IModule) => module.module_no === moduleId);
}
