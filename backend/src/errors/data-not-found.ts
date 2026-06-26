export class DataNotFound extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DataNotFound";
    this.message = message;

    Error.captureStackTrace(this, this.constructor);
  }
}
