import Vue from "vue";

import { Module, VuexModule, Mutation } from "vuex-module-decorators";
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

  @Mutation
  addModules(arr: Array<IModule>): void {
    this.moduleArr.push(...arr);
  }

  @Mutation
  saveToMySelection(moduleId: string): void {
    this.mySelection.push(moduleId);
  }

  @Mutation
  removeFromMySelection(moduleId: string): void {
    const index = this.mySelection.indexOf(moduleId, 0);
    if (index > -1) {
      this.mySelection.splice(index, 1);
    }
  }

  get getMySelection(): Array<string> {
    return this.mySelection;
  }

  get getModules(): Array<IModule> {
    return this.moduleArr;
  }
}
