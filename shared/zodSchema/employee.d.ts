import { EGender } from "@shared/constants/enums";
import z from "zod";
export declare const employeeValidationSchema: {
    create: z.ZodObject<{
        name: z.ZodString;
        email_address: z.ZodString;
        phone_number: z.ZodString;
        gender: z.ZodNativeEnum<typeof EGender>;
        cafe_id: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        gender: EGender;
        email_address: string;
        phone_number: string;
        cafe_id?: string | null | undefined;
    }, {
        name: string;
        gender: EGender;
        email_address: string;
        phone_number: string;
        cafe_id?: string | null | undefined;
    }>;
    update: z.ZodObject<z.objectUtil.extendShape<{
        name: z.ZodString;
        email_address: z.ZodString;
        phone_number: z.ZodString;
        gender: z.ZodNativeEnum<typeof EGender>;
        cafe_id: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    }, {
        id: z.ZodString;
    }>, "strip", z.ZodTypeAny, {
        name: string;
        id: string;
        gender: EGender;
        email_address: string;
        phone_number: string;
        cafe_id?: string | null | undefined;
    }, {
        name: string;
        id: string;
        gender: EGender;
        email_address: string;
        phone_number: string;
        cafe_id?: string | null | undefined;
    }>;
    delete: z.ZodObject<{
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
    }, {
        id: string;
    }>;
};
