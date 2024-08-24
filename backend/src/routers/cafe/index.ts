import express, { NextFunction, Request, Response } from "express";
import CafeService from "./service";
import { HttpStatus } from "@shared/constants/enums";

const router = express.Router();

const cafeServices = new CafeService();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const requestQuery = req.query;
    const input = requestQuery.location as string;
    const results = await cafeServices.getCafes(input);
    return res.responseWrapper({ output: results });
  } catch (error) {
    return next(error);
  }
});

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const requestInput = req.body;
    const parsedInput = cafeServices.validateCreationInput(requestInput);
    const results = await cafeServices.createCafe(parsedInput);
    res.responseWrapper({ output: results, status: HttpStatus.CREATED });
  } catch (error) {
    return next(error);
  }
});

router.put("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const requestInput = req.body;
    const parsedInput = cafeServices.validateUpdateInput(requestInput);
    await cafeServices.updateCafe(parsedInput);
    res.responseWrapper({ status: HttpStatus.UPDATED });
  } catch (error) {
    return next(error);
  }
});

router.delete("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const requestInput = req.body;
    const parsedInput = cafeServices.validateDeleteInput(requestInput);
    await cafeServices.deleteCafe(parsedInput);
    res.responseWrapper({ status: HttpStatus.UPDATED });
  } catch (error) {
    return next(error);
  }
});

export default router;
