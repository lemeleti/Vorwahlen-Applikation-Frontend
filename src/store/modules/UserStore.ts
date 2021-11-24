/* eslint-disable prettier/prettier */
import Vue from "vue";

import { Module, VuexModule, Action, Mutation } from "vuex-module-decorators";
import User from "@/models/user";
import store from "@/store";

@Module({ store, dynamic: true, name: "userStore" })
export default class UserStore extends VuexModule {
  private user: User = <User>{};
  private isAuthenticated = false;
  private isStoreInitialized = false;

  @Mutation
  async fetchUserDataAsync(): Promise<void> {
    try {
      const isAuthenticated = (await Vue.axios.get<boolean>("/session/is-authenticated")).data;
      if (isAuthenticated) {
        this.user = (await Vue.axios.get<User>("/session/info")).data;
        this.isAuthenticated = true;
        this.isStoreInitialized = true;
      }
    } catch (e) {
      console.error(e);
    }
  }

  @Mutation
  removeUserData(): void {
    this.user = <User>{};
    this.isAuthenticated = false;
    this.isStoreInitialized = false;
  }

  @Action({ commit: "fetchUserDataAsync" })
  fetchUserData(): boolean {
    return this.isAuthenticated;
  }

  get isUserAuthenticated(): boolean {
    return this.isAuthenticated;
  }

  get isUserAdmin(): boolean {
    return this.user.role === "ADMIN";
  }

  get isUserInitialized(): boolean {
    return this.isStoreInitialized;
  }

  get isUserIP(): boolean {
    return this.user.isIP;
  }
}
