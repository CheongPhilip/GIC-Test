import { HttpStatus } from "@shared/constants/enums";

class CustomError extends Error {
  code: HttpStatus;
  constructor(code: HttpStatus, message: string) {
    super(message);
    this.code = code;
  }
}

export default CustomError;
