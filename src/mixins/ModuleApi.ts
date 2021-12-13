import ErrorHandler from "@/decorators/ErrorHandler";
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

  @ErrorHandler()
  async scrapeModuleData(): Promise<void> {
    await Vue.axios.post(`${this.basePath}/eventodata/scrape`);
  }

  @ErrorHandler()
  async getEventoDataById(id: string): Promise<EventoData> {
    return (
      await Vue.axios.get<EventoData>(`${this.basePath}/${id}/eventodata`)
    ).data;
  }

  get eventoUrl() {
    return (moduleId: number): string => {
      return `https://eventoweb.zhaw.ch/Evt_Pages/Brn_ModulDetailAZ.aspx?IDAnlass=${moduleId}&IdLanguage=1&date=662249088000000000`;
    };
  }
}
