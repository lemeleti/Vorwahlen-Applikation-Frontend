export default interface ModuleElection {
  id: number;
  studentEmail: string;
  electedModules: Array<string>;
  isElectionValid: boolean;
}
