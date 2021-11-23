import ModuleCategory from "./moduleCategory";

interface ExecutionSemester {
  [index: string]: Array<number>;
}

export default interface Module {
  moduleNo: string;
  moduleTitle: string;
  executionSemester: ExecutionSemester;
  category: ModuleCategory;
  language: string;
  credits: number;
  consecutiveModuleNo: string;
}
