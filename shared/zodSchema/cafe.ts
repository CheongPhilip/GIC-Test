import { z } from "zod";

const commonSchema = z.object({
  name: z.string().trim().min(6).max(10),
  description: z.string().trim().min(1).max(255),
  logo: z.string().trim().optional(),
  location: z.string().trim().min(1).max(255),
});

export const cafeValidationSchema = {
  create: commonSchema,
  update: commonSchema.extend({
    id: z.string().trim().uuid(),
  }),
  delete: z.object({
    id: z.string().trim().uuid(),
  }),
};
