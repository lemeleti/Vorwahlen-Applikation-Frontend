import ModuleCategory from "./moduleCategory";
export default interface Module {
  moduleNo: string;
  moduleTitle: string;
  moduleId: number;
  semester: number;
  category: ModuleCategory;
  language: string;
  credits: number;
  institute: string;
  moduleGroup: string;
  consecutiveModuleNo: string;
}
