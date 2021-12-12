import ModuleCategory from "./moduleCategory";

export default interface ElectionStatusElement {
  moduleCategory: ModuleCategory;
  isValid: boolean;
  reasons?: Array<string>;
}
