export class UserError extends Error {
  status: number;
  message: string;
  meta?: any;
  constructor(message: string, status: number, meta?: any) {
    super(message);
    (this.status = status), (this.message = message);
    this.meta = meta;

    Error.captureStackTrace(this);
  }
}
