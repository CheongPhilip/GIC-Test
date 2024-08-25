import { EGender } from "@shared/constants/enums";
import z from "zod";

const commonSchema = z.object({
  name: z.string().trim().min(6).max(10),
  email_address: z.string().trim().email(),
  phone_number: z
    .string()
    .length(8)
    .regex(/^[8|9]\d+$/),
  gender: z.nativeEnum(EGender),
  cafe_id: z.string().uuid().optional().nullable(),
});

export const employeeValidationSchema = {
  create: commonSchema,
  update: commonSchema.extend({
    id: z.string().trim().length(9),
  }),
  delete: z.object({
    id: z.string().trim().length(9),
  }),
};
