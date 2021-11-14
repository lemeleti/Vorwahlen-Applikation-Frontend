import { ModuleCategories } from "./moduleList";

export default interface Module {
  module_no: string;
  module_title: string;
  full_time_semester_list: Array<number>;
  category: ModuleCategories;
  language: string;
}
