/* eslint-disable prettier/prettier */
import Vue from "vue";

import { Module, VuexModule, Action, Mutation } from "vuex-module-decorators";
import User from "@/models/user";
import store from "@/store";
import Student from "@/models/student";

@Module({ store, dynamic: true, name: "userStore" })
export default class UserStore extends VuexModule {
  private user: User = <User>{};
  private student: Student = <Student>{};
  private isAuthenticated = false;
  private isStoreInitialized = false;

  @Mutation
  removeUserData(): void {
    this.user = <User>{};
    this.isAuthenticated = false;
    this.isStoreInitialized = false;
  }

  @Mutation
  setIp(ip: boolean): void {
    this.student.ip = ip;
  }

  @Mutation
  setIsAuthenticated(isAuthenticated: boolean): void {
    this.isAuthenticated = isAuthenticated;
  }

  @Mutation
  setIsStoreInitialized(isStoreInitialized: boolean): void {
    this.isStoreInitialized = isStoreInitialized;
  }

  @Mutation
  setStudent(student: Student): void {
    this.student = student;
  }

  @Mutation
  setUser(user: User): void {
    this.user = user;
  }

  @Action
  async fetchUserData(): Promise<void> {
    try {
      const isAuthenticated = (await Vue.axios.get<boolean>("/session/is-authenticated")).data;
      if (isAuthenticated) {
        this.context.commit("setUser", (await Vue.axios.get<User>("/session/info")).data);
        this.context.commit("setStudent", (await Vue.axios.get<Student>(`/students/${this.context.getters.email}`)).data);
        this.context.commit("setIsAuthenticated", true);
        this.context.commit("setIsStoreInitialized", true);
      }
    } catch (e) {
      console.error(e);
    }
  }

  get email(): string {
    return this.user.mail;
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
    return this.student.ip;
  }

  get isUserTZ(): boolean {
    return this.student.tz;
  }

  get isSecondElection(): boolean {
    return this.student.secondElection;
  }

  get isFirstTimeSetup(): boolean {
    return this.student.firstTimeSetup;
  }
}
