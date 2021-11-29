export default interface ModuleElection {
  electedModules: Array<string>;
  overflowedElectedModules: Array<string>;
  electionValid: boolean;
}
