import ElectionStructureElement from "./electionStructureElement";

export default interface ElectionStructure {
  electedModules: Array<ElectionStructureElement>;
  overflowedModules: Array<ElectionStructureElement>;
}
