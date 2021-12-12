import ModuleElection from "@/models/moduleElection";
import { Component } from "vue-property-decorator";
import Api from "./Api";

@Component
export default class ModuleElectionApi extends Api<ModuleElection> {
  get $moduleElectionApi(): ModuleElectionApi {
    this.basePath = "/elections";
    return this;
  }

  async getModuleExport(): Promise<void> {
    const data: Blob = (
      await this.$http.get<Blob>(`${this.basePath}/export`, {
        responseType: "blob",
      })
    ).data;
    const url: string = window.URL.createObjectURL(data);
    window.open(url);
  }
}
