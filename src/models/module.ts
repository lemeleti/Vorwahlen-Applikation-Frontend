import ModuleCategory from "./moduleCategory";
export default interface Module {
  moduleNo: string;
  moduleTitle: string;
  semester: number;
  category: ModuleCategory;
  language: string;
  credits: number;
  consecutiveModuleNo: string;
}
