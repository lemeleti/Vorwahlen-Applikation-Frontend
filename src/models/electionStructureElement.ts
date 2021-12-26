import ModuleCategory from "./moduleCategory";

export default interface ElectionStructureElement {
  id: string;
  name: string;
  credits: number;
  category: ModuleCategory;
  isPlaceholder: boolean;
  semester: number;
}
