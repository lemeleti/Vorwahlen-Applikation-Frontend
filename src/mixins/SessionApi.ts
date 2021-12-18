import { Component } from "vue-property-decorator";
import Api from "./Api";
import User from "@/models/user";
import ErrorHandler from "@/decorators/ErrorHandler";

@Component
export default class SessionApi extends Api<User> {
  path = "/session";

  @ErrorHandler()
  async get(): Promise<User> {
    return (await this.axios.get<User>(this.path)).data;
  }

  @ErrorHandler()
  async isAuthenticated(): Promise<boolean> {
    return (await this.axios.get<boolean>(`${this.path}/is-authenticated`))
      .data;
  }

  @ErrorHandler()
  async isAdmin(): Promise<boolean> {
    return (await this.axios.get<boolean>(`${this.path}/is-admin`)).data;
  }
}
