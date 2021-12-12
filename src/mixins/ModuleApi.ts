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
}
