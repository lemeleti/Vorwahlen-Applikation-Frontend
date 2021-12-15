/* eslint-disable prettier/prettier */

import { Module, VuexModule, Mutation, MutationAction } from "vuex-module-decorators";
import User from "@/models/user";
import store from "@/store";
import Student from "@/models/student";
import StudentApi from "@/mixins/StudentApi";
import SessionApi from "@/mixins/SessionApi";
import _ from "lodash";

interface StoreState {
  user: User | null;
  student: Student | null;
  isAuthenticated: boolean;
  isStoreInitialized: boolean;
}

@Module({ store, dynamic: true, name: "userStore" })
export default class UserStore extends VuexModule {
  user: User | null = null;
  student: Student | null = null;
  isAuthenticated = false;
  isStoreInitialized = false;

  get isUserAdmin(): boolean {
    return _.get(this.user, "role", "USER") === "ADMIN";
  }

  get isStudent(): boolean {
    return _.get(this.user, "exists", false);
  }

  @Mutation
  setIp(ip: boolean): void {
    if (this.student) {
      this.student.ip = ip;
    }
  }

  @Mutation
  removeUserData(): void {
    this.user = <User>{};
    this.isAuthenticated = false;
    this.isStoreInitialized = false;
  }

  @MutationAction
  async initUserStore(): Promise<StoreState> {
    const studentApi = new StudentApi();
    const sessionApi = new SessionApi();
    const isAuthenticated = await sessionApi.isAuthenticated();
    const isStoreInitialized = true;
    const user: User | null = isAuthenticated ? await sessionApi.get() : null;
    let student: Student | null = null;
    
    if (user && user.exists) {
      student = await studentApi.getById(user.mail);
    }
    
    return { isAuthenticated, isStoreInitialized, student, user }
  }
}
