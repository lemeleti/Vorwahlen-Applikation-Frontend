export default interface StudentNotification {
  email: string;
  password: string;
  subject: string;
  message: string;
  studentMailAddresses: Array<string>;
}
