import { ModuleList, Node, ModuleCategories } from "../models/moduleList";

export function generateFillerList(): ModuleList {
  const numKontextModules = 3;
  const numFachlichModules = 8;

  // Create filler modules.
  const moduleList = new ModuleList();
  const baseNode: Node = {
    next: null,
    credits: 0,
    isFiller: true,
    moduleCategorie: ModuleCategories.FACHLICH,
    moduleId: "N/A",
    moduleName: "",
  };

  // Create kontext filler
  for (let i = 0; i < numKontextModules; i++) {
    const kontextNode = { ...baseNode };
    kontextNode.credits = 2;
    kontextNode.moduleName = "Kontext-Wahlpflichtmodul";
    kontextNode.moduleCategorie = ModuleCategories.KONTEXT;
    moduleList.add(kontextNode);
  }

  // create fachlich filler
  for (let i = 0; i < numFachlichModules; i++) {
    const fachlichNode = { ...baseNode };
    fachlichNode.credits = 4;
    fachlichNode.moduleName = "Fachliches Wahlpflichtmodul";
    fachlichNode.moduleCategorie = ModuleCategories.FACHLICH;
    moduleList.add(fachlichNode);
  }

  // create ueberfachlich module
  const ueberfachlichModule = { ...baseNode };
  ueberfachlichModule.credits = 4;
  ueberfachlichModule.moduleName = "Überfachliches Wahlpflichtmodul";
  ueberfachlichModule.moduleCategorie = ModuleCategories.PROJEKT;

  // create project modules
  const paModule = { ...baseNode };
  paModule.credits = 6;
  paModule.moduleName = "Projektarbeit in Informatik";

  const baModule = { ...baseNode };
  baModule.credits = 12;
  baModule.moduleName = "Bachelorarbeit in Informatik";

  moduleList.add(paModule);
  moduleList.add(baModule);

  return moduleList;
}
