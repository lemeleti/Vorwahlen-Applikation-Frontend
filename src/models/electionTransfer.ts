import ElectionStatus from "./electionStatus";
import ElectionStructure from "./electionStructure";

export default interface ElectionTansfer {
  electionStructure: ElectionStructure;
  electionSaved: boolean;
  electionValid: boolean;
  electionStatusDTO: ElectionStatus;
}
