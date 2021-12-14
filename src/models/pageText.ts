enum UserType {
  ANONYMOUS = "anonym",
  FULL_TIME = "vz",
  PART_TIME_FIRST_ELECTION = "tz1",
  PART_TIME_SECOND_ELECTION = "tz2",
}

export default interface PageText {
  id: number;
  page: string;
  userType: UserType;
  isIpText: boolean;
  textNumber: number;
  text: string;
}
