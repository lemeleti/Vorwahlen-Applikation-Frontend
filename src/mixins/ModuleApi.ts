import EventoData from "@/models/eventoData";
import Module from "@/models/module";
import { Component, Vue } from "vue-property-decorator";
import Api from "./Api";

@Component
export default class ModuleApi extends Api<Module> {
  get $moduleApi(): ModuleApi {
    this.basePath = "/modules";
    return this;
  }

  async scrapeModuleData(): Promise<void> {
    await Vue.axios.post(`${this.basePath}/eventodata/scrape`);
  }

  async getEventoDataById(id: string): Promise<EventoData> {
    return (
      await Vue.axios.get<EventoData>(`${this.basePath}/${id}/eventodata`)
    ).data;
  }
}
