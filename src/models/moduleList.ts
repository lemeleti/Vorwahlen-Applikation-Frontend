import { stringify, parse } from "flatted";
import Module from "./module";

/**
 * This node resembles mainly the module interface,
 * but add some functionality in order to make it compatible with a doubly linked list.
 * //TODO add semester vz + tz
 */
export interface Node {
  next: Node | null;
  moduleName: string;
  moduleId: string;
  moduleCategory: ModuleCategories;
  semester: number;
  credits: number;
  isFiller: boolean;
}

export interface ModuleExport {
  electedModules: Array<string>;
  overflowedElectedModules: Array<string>;
}

/**
 * Enumeration of all different module categories.
 */
export enum ModuleCategories {
  SUBJECT_MODULE = "SUBJECT_MODULE",
  INTERDISCIPLINARY_MODULE = "INTERDISCIPLINARY_MODULE",
  CONTEXT_MODULE = "CONTEXT_MODULE",
  PROJECT_MODULE = "PROJECT_MODULE",
  BACHELOR_MODULE = "BACHELOR_MODULE",
  DISPENSED_PA_MODULE = "DISPENSED_PA_MODULE",
  DISPENSED_WPM_MODULE = "DISPENSED_WPM_MODULE",
}

/**
 * This class is based on a linked list.
 * The main goal is to provide some placeholder modules,
 * which can easily be swapped out to a module chosen by the user.
 */
export class ModuleList {
  private head!: Node | null;
  private tail!: Node | null;
  private overflowedModules: Array<Module> = [];

  /**
   * Creates a module list instance.
   * @param {string} clazz This parameter is optional.
   * When provided a json encoded string will be restored to an instance,
   * otherwise a new instance will be created.
   */
  constructor(clazz?: string) {
    if (clazz) {
      const obj = parse(clazz);
      this.head = obj.head;
      this.tail = obj.tail;
    }
  }

  /**
   * Adds a node to the module list.
   * @param {Node} node Node that should be added.
   */
  public add(node: Node): void {
    if (this.tail) {
      node.next = null;
      this.tail.next = node;
      this.tail = this.tail.next;
    } else {
      this.head = node;
      this.tail = this.head;
    }
  }

  /**
   * Searches the next free module (filler)
   * and replaces it with an actual module.
   * @param {ModuleCategories} cat Categorie of the filler module.
   * @param {Module} module Module which should replace the filler.
   * @returns {boolean} true if replace was successful otherwise false
   */
  public replaceModule(cat: ModuleCategories, module: Module): boolean {
    let isReplaced = false;
    const nextModule: Node | null = this.getNextFiller(module);
    if (nextModule) {
      this.mapModuleToNode(module, nextModule);
      isReplaced = true;
    } else {
      this.overflowedModules.push(module);
    }

    return isReplaced;
  }

  /**
   * Removes a user chosen module and replaces it,
   * with a filler Module.
   * @param {Module} module Module which should be removed.
   * @returns {boolean} true if module could be removed
   * otherwise false.
   */
  public removeModule(module: Module): boolean {
    let isRemoved = true;
    let index = this.head;
    const overflowedModuleIndex = this.overflowedModules.indexOf(module);
    const replacementModule = this.findReplacementModule(module.category);

    while (index && index.moduleId !== module.module_no) {
      index = index.next;
    }

    if (index && replacementModule) {
      index.moduleName = replacementModule.module_title;
      index.moduleId = replacementModule.module_no;
      const replacementModuleIndex =
        this.overflowedModules.indexOf(replacementModule);
      this.overflowedModules.splice(replacementModuleIndex, 1);
    } else if (index) {
      this.restoreNodeToDefault(index);
    } else if (overflowedModuleIndex >= 0) {
      this.overflowedModules.splice(overflowedModuleIndex, 1);
    } else {
      isRemoved = false;
    }

    return isRemoved;
  }

  /**
   * Sets the the list of overflowed modules
   * @param {Array<Module>} overflowedModules list of overflowed modules
   */
  public setOverflowedModules(overflowedModules: Array<Module>): void {
    this.overflowedModules = overflowedModules;
  }

  /**
   * Exports all user elected modules by their id.
   * @param {Array<string>} arr Array containing elected module id's.
   */
  public export(): ModuleExport {
    return <ModuleExport>{
      electedModules: this.extractElectedModulesIds(),
      overflowedElectedModules: this.overflowedModules.map(
        (module: Module) => module.module_no
      ),
    };
  }

  /**
   * Get pointer to the head of the list.
   * @returns {Node | null} Returns the current head
   * if the list is not empty otherwise returns null;
   */
  public getHead(): Node | null {
    return this.head;
  }

  /**
   * Transforms this class instance to a json string.
   * @returns {string} json encoded string.
   */
  public static toJSON(moduleList: ModuleList): string {
    return stringify(moduleList);
  }

  private restoreNodeToDefault(node: Node) {
    node.moduleName = this.getTextForCategory(node.moduleCategory);
    node.moduleId = "NA";
    node.isFiller = true;
  }

  private findReplacementModule(cat: ModuleCategories): Module | undefined {
    return this.overflowedModules.find(
      (module: Module) => module.category === cat
    );
  }

  private getNextFiller(module: Module): Node | null {
    let res = null;
    let index = this.head;
    const semester = module.full_time_semester_list[0]; //TODO check if student is vz or tz
    while (index) {
      if (
        index.moduleCategory === module.category &&
        index.isFiller &&
        semester === index.semester
      ) {
        res = index;
        break;
      }
      index = index.next;
    }

    return res;
  }

  private extractElectedModulesIds(): Array<string> {
    const electedModules = new Array<string>();
    let index = this.head;
    while (index) {
      if (!index.isFiller) {
        electedModules.push(index.moduleId);
      }
      index = index.next;
    }
    return electedModules;
  }

  private mapModuleToNode(module: Module, node: Node): void {
    node.moduleName = module.module_title;
    node.moduleId = module.module_no;
    node.isFiller = false;
  }

  private getTextForCategory(cat: ModuleCategories): string {
    let text = "";

    switch (cat) {
      case ModuleCategories.SUBJECT_MODULE:
        text = "Fachliches Wahlpflichmodul";
        break;
      case ModuleCategories.INTERDISCIPLINARY_MODULE:
        text = "Ueberfachliches Wahlpflichmodul";
        break;
      case ModuleCategories.CONTEXT_MODULE:
        text = "Kontext Wahlpflichmodul";
        break;
      case ModuleCategories.PROJECT_MODULE:
        text = "Projektmodul";
    }

    return text;
  }
}
