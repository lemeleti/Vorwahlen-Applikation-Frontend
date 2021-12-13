import ModuleElection from "@/models/moduleElection";
import { Component } from "vue-property-decorator";
import ElectionTansfer from "@/models/electionTransfer";
import Api from "./Api";
import ErrorHandler from "@/decorators/ErrorHandler";

@Component
export default class ModuleElectionApi extends Api<ModuleElection> {
  get $moduleElectionApi(): ModuleElectionApi {
    this.basePath = "/elections";
    return this;
  }

  @ErrorHandler()
  async getElectionStructure(id: string): Promise<ElectionTansfer> {
    return (
      await this.axios.get<ElectionTansfer>(`${this.basePath}/${id}/structure`)
    ).data;
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
