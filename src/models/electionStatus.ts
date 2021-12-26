import ElectionStatusElement from "./electionStatusElement";

export default interface ElectionStatus {
  subjectValidation: ElectionStatusElement;
  contextValidation: ElectionStatusElement;
  interdisciplinaryValidation: ElectionStatusElement;
  additionalValidation: ElectionStatusElement;
}
