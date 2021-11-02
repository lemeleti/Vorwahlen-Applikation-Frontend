import { ModuleList, Node, ModuleCategories } from "../models/moduleList";

/**
 * //TODO handle semester elsewhere.
 * @returns 
 */
export function generateFillerList(): ModuleList {
  const numKontextModules = 3;
  const numFachlichModules = 8;

  // Create filler modules.
  const moduleList = new ModuleList();
  const baseNode: Node = {
    next: null,
    credits: 0,
    isFiller: true,
    semester: 5,
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

    if (i == 2) {
      kontextNode.semester = 6;
    }

    moduleList.add(kontextNode);
  }

  // create fachlich filler
  for (let i = 0; i < numFachlichModules; i++) {
    const fachlichNode = { ...baseNode };
    fachlichNode.credits = 4;
    fachlichNode.moduleName = "Fachliches Wahlpflichtmodul";
    fachlichNode.moduleCategorie = ModuleCategories.FACHLICH;

    if (i >= 4) {
      fachlichNode.semester = 6;
    }

    moduleList.add(fachlichNode);
  }

  // create ueberfachlich module
  const ueberfachlichModule = { ...baseNode };
  ueberfachlichModule.credits = 4;
  ueberfachlichModule.moduleName = "Überfachliches Wahlpflichtmodul";
  ueberfachlichModule.moduleCategorie = ModuleCategories.UEBERFACHLICH;
  moduleList.add(ueberfachlichModule);

  // create project modules
  const paModule = { ...baseNode };
  paModule.credits = 6;
  paModule.moduleName = "Projektarbeit in Informatik";
  paModule.moduleCategorie = ModuleCategories.PROJEKT;

  const baModule = { ...baseNode };
  baModule.credits = 12;
  baModule.semester = 6;
  baModule.moduleName = "Bachelorarbeit in Informatik";
  baModule.moduleCategorie = ModuleCategories.PROJEKT;

  moduleList.add(paModule);
  moduleList.add(baModule);

  return moduleList;
}
