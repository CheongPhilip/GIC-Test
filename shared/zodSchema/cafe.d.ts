import { z } from "zod";
export declare const cafeValidationSchema: {
    create: z.ZodObject<{
        name: z.ZodString;
        description: z.ZodString;
        logo: z.ZodOptional<z.ZodString>;
        location: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        name: string;
        location: string;
        description: string;
        logo?: string | undefined;
    }, {
        name: string;
        location: string;
        description: string;
        logo?: string | undefined;
    }>;
    update: z.ZodObject<z.objectUtil.extendShape<{
        name: z.ZodString;
        description: z.ZodString;
        logo: z.ZodOptional<z.ZodString>;
        location: z.ZodString;
    }, {
        id: z.ZodString;
    }>, "strip", z.ZodTypeAny, {
        name: string;
        id: string;
        location: string;
        description: string;
        logo?: string | undefined;
    }, {
        name: string;
        id: string;
        location: string;
        description: string;
        logo?: string | undefined;
    }>;
    delete: z.ZodObject<{
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
    }, {
        id: string;
    }>;
};
