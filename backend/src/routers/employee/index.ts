import express, { NextFunction, Request, Response } from "express";
import EmployeeService from "./service";
import { HttpStatus } from "@shared/constants/enums";

const router = express.Router();

const employeeServices = new EmployeeService();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const requestQuery = req.query;
    const input = requestQuery.cafe as string;
    const results = await employeeServices.getEmployees(input);
    res.responseWrapper({ output: results });
  } catch (error) {
    return next(error);
  }
});

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const requestInput = req.body;
    const parsedInput = employeeServices.validateCreationInput(requestInput);
    const results = await employeeServices.createEmployee(parsedInput);
    res.responseWrapper({ output: results, status: HttpStatus.CREATED });
  } catch (error) {
    return next(error);
  }
});

router.put("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const requestInput = req.body;
    const parsedInput = employeeServices.validateUpdateInput(requestInput);
    await employeeServices.updateEmployee(parsedInput);
    res.responseWrapper({ status: HttpStatus.UPDATED });
  } catch (error) {
    return next(error);
  }
});

router.delete("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const requestInput = req.body;
    const parsedInput = employeeServices.validateDeleteInput(requestInput);
    await employeeServices.deleteEmployee(parsedInput);
    res.responseWrapper({ status: HttpStatus.UPDATED });
  } catch (error) {
    return next(error);
  }
});

export default router;
