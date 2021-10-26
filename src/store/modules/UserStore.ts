import Vue from "vue";

import { Module, VuexModule, Action, Mutation } from "vuex-module-decorators";
import User from "@/models/user";
import store from "@/store";

@Module({ store, dynamic: true, name: "userStore" })
export default class UserStore extends VuexModule {
  user: User = <User>{};
  isAuthenticated = false;

  @Mutation
  async fetchUserDataAsync(): Promise<void> {
    try {
      const resp = await Vue.axios.get<User>("../session/info");
      if (resp.status == 200) {
        this.user = resp.data;
        this.isAuthenticated = true;
      }
    } catch (e) {
      console.log(e);
    }
  }

  @Mutation
  removeUserData(): void {
    this.user = <User>{};
    this.isAuthenticated = false;
  }

  @Action({ commit: "fetchUserDataAsync" })
  fetchUserData(): boolean {
    return this.isAuthenticated;
  }

  get isUserAuthenticated(): boolean {
    return this.isAuthenticated;
  }
}
