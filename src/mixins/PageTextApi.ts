import ErrorHandler from "@/decorators/ErrorHandler";
import PageText from "@/models/pageText";
import { Component } from "vue-property-decorator";
import Api from "./Api";

@Component
export default class PageTextApi extends Api<PageText> {
  get $pageTextApi(): PageTextApi {
    this.basePath = "/texts/frontpage";
    return this;
  }

  @ErrorHandler()
  async getFullTimePageText(): Promise<Array<PageText>> {
    return (await this.axios.get<Array<PageText>>(`${this.basePath}/vz`)).data;
  }

  @ErrorHandler()
  async getPartTimeFirstElection(): Promise<Array<PageText>> {
    return (await this.axios.get<Array<PageText>>(`${this.basePath}/tz1`)).data;
  }

  @ErrorHandler()
  async getPartTimeSecondElectionText(): Promise<Array<PageText>> {
    return (await this.axios.get<Array<PageText>>(`${this.basePath}/tz2`)).data
  }

  @ErrorHandler()
  async getAnonymousPageText(): Promise<Array<PageText>> {
    // eslint-disable-next-line prettier/prettier
    return (await this.axios.get<Array<PageText>>(`${this.basePath}/anonym`)).data;
  }
}
