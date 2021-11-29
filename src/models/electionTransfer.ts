import ElectionStructure from "./electionStructure";

export default interface ElectionTansfer {
  electionStructure: ElectionStructure;
  electionSaved: boolean;
  electionValid: boolean;
}
