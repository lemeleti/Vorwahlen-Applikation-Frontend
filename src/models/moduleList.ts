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
  moduleCategorie: ModuleCategories;
  semester: number;
  credits: number;
  isFiller: boolean;
}

/**
 * Enumeration of all different module categories.
 */
export enum ModuleCategories {
  SUBJECT_MODULE = "SUBJECT_MODULE",
  INTERDISCIPLINARY_MODULE = "INTERDISCIPLINARY_MODULE",
  CONTEXT_MODULE = "CONTEXT_MODULE",
  PROJEKT = "PROJEKT",
}

/**
 * This class is based on a linked list.
 * The main goal is to provide some placeholder modules,
 * which can easily be swapped out to a module chosen by the user.
 */
export class ModuleList {
  private head!: Node | null;
  private tail!: Node | null;

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
    const nextModule: Node | null = this.getNextFillerByCat(cat);
    if (nextModule) {
      this.mapModuleToNode(module, nextModule);
      isReplaced = true;
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
    let isRemoved = false;
    let index = this.head;

    while (index) {
      if (index.moduleId === module.module_no) {
        index.moduleName = index.moduleCategorie;
        index.moduleId = "NA";
        isRemoved = true;
        index.isFiller = true;
      }
      index = index.next;
    }

    return isRemoved;
  }

  /**
   * Exports all user elected modules by their id.
   * @param {Array<string>} arr Array containing elected module id's.
   */
  public export(): Array<string> {
    const modules = new Array<string>();
    let index = this.head;
    while (index) {
      if (!index.isFiller) {
        modules.push(index.moduleId);
      }
      index = index.next;
    }
    return modules;
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

  private getNextFillerByCat(cat: ModuleCategories): Node | null {
    let res = null;
    let index = this.head;
    while (index) {
      if (index.moduleCategorie === cat && index.isFiller) {
        res = index;
        break;
      }
      index = index.next;
    }

    return res;
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
      case ModuleCategories.PROJEKT:
        text = "Projektmodul";
    }

    return text;
  }
}
