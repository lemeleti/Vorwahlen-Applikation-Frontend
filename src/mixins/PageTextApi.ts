/* eslint-disable prettier/prettier */
import ErrorHandler from "@/decorators/ErrorHandler";
import PageText from "@/models/pageText";
import { Component } from "vue-property-decorator";
import Api from "./Api";

@Component
export default class PageTextApi extends Api<PageText> {
  path = "/texts";

  @ErrorHandler()
  async getFullTimePageText(): Promise<Array<PageText>> {
    return (await this.axios.get<Array<PageText>>(`${this.basePath}/frontpage/vz`)).data;
  }

  @ErrorHandler()
  async getPartTimeFirstElection(): Promise<Array<PageText>> {
    return (await this.axios.get<Array<PageText>>(`${this.basePath}/frontpage/tz1`)).data;
  }

  @ErrorHandler()
  async getPartTimeSecondElectionText(): Promise<Array<PageText>> {
    return (await this.axios.get<Array<PageText>>(`${this.basePath}/frontpage/tz2`)).data
  }

  @ErrorHandler()
  async getAnonymousPageText(): Promise<Array<PageText>> {
    // eslint-disable-next-line prettier/prettier
    return (await this.axios.get<Array<PageText>>(`${this.basePath}/frontpage/anonym`)).data;
  }
}
