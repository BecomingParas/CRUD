import { UserError } from "@/error";

export class InvalidUserPayload extends UserError {
  constructor(meta: any) {
    super("Invalid payload", 400, meta);
    Error.captureStackTrace(this);
  }
}
