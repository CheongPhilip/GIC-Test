import express, { Request, Response, NextFunction } from "express";
import { ForeignKeyConstraintError, UniqueConstraintError } from "sequelize";
import { ZodError } from "zod";
import CustomError from "./error";
import { HttpStatus } from "@shared/constants/enums";

express.response.responseWrapper = function ({ output, status = HttpStatus.OK }) {
  const data = { success: true, data: null };
  if (output) {
    data.data = output;
  }
  return this.status(status).json(data);
};

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ZodError) {
    return res.status(HttpStatus.BAD_REQUEST).send({
      success: false,
      errors: err.issues,
    });
  }

  if (err instanceof CustomError && (err.code === HttpStatus.NOT_FOUND || err.code === HttpStatus.BAD_REQUEST || err.code === HttpStatus.CONFLICT)) {
    return res.status(err.code).send({
      success: false,
      errors: err.message,
    });
  }

  if (err instanceof ForeignKeyConstraintError) {
    return res.status(HttpStatus.BAD_REQUEST).send({
      success: false,
      errors: "Foreign key constraint error",
    });
  }

  if (err instanceof UniqueConstraintError) {
    return res.status(HttpStatus.CONFLICT).send({
      success: false,
      errors: `Duplicated unique value: ${JSON.stringify(err.fields, null, 2)}`,
    });
  }

  return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
    success: false,
    errors: "Somthing went wrong. Please try again later.",
  });
};
