import { ModuleCategories } from "./moduleList";

export default interface Module {
  module_no: string;
  module_title: string;
  category: ModuleCategories;
  language: string;
}
