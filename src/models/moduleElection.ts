export default interface ModuleElection {
  id: number;
  studentEmail: string;
  electedModules: Array<string>;
  electionValid: boolean;
}
