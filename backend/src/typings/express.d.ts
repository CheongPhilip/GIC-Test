import { HttpStatus } from "@shared/constants/enums";
import { Response } from "express";
import { number } from "zod";

declare module "express-serve-static-core" {
  interface Response {
    responseWrapper: ({ output, status = HttpStatus.OK }: { output?: any; status?: number }) => Response;
  }
}
