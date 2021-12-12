export default interface ServerException {
  message: string;
  causes?: Array<string>;
}
