import ModuleElection from "@/models/moduleElection";
import { Component } from "vue-property-decorator";
import ElectionTansfer from "@/models/electionTransfer";
import Api from "./Api";
import ErrorHandler from "@/decorators/ErrorHandler";

@Component
// eslint-disable-next-line prettier/prettier
export default class ModuleElectionApi extends Api<ModuleElection> {
  path = "/elections";

  @ErrorHandler()
  async getElectionStructure(id: string): Promise<ElectionTansfer> {
    return (
      await this.axios.get<ElectionTansfer>(`${this.path}/${id}/structure`)
    ).data;
  }

  @ErrorHandler()
  async triggerValidationUpdate(id: string): Promise<void> {
    await this.axios.post(`${this.path}/${id}/validate`);
  }

  @ErrorHandler()
  async closeElection(message?: string): Promise<void> {
    await this.axios.post(`${this.path}/close`);
    if (message) {
      this.sendNotification(message);
    }
  }

  async getModuleExport(): Promise<void> {
    const data: Blob = (
      await this.$http.get<Blob>(`${this.path}/export`, {
        responseType: "blob",
      })
    ).data;
    const url: string = window.URL.createObjectURL(data);
    window.open(url);
  }
}
