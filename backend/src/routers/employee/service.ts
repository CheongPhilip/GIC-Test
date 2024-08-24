import { literal, WhereOptions } from "sequelize";
import { Cafe, Employee } from "../../db/models";
import CustomError from "../../utils/error";
import { z } from "zod";
import CafeEmployee from "../../db/models/cafe_employee";
import {
  IEmployeeCreationAttributes,
  IEmployeeDeleteAttributes,
  IEmployeeGetAttributes,
  IEmployeeUpdateAttributes,
} from "@shared/interfaces/IEmployee";
import { EGender, HttpStatus } from "@shared/constants/enums";

class EmployeeService {
  #creationInputValidation;
  #updateInputValidation;
  #deleteInputValidation;
  constructor() {
    this.#creationInputValidation = z.object({
      name: z.string().trim().min(1).max(255),
      email_address: z.string().email(),
      phone_number: z
        .string()
        .length(8)
        .regex(/^[8|9]\d+$/),
      gender: z.nativeEnum(EGender),
      cafeEmployee: z
        .object({
          cafe_id: z.string().uuid(),
          start_date: z
            .string()
            .datetime()
            .transform((val) => new Date(val)),
        })
        .nullable(),
    });
    this.#updateInputValidation = this.#creationInputValidation.extend({
      id: z.string().length(9),
      cafeEmployee: z
        .object({
          cafe_id: z.string().uuid(),
          start_date: z
            .string()
            .datetime()
            .transform((val) => new Date(val)),
        })
        .nullable(),
    });
    this.#deleteInputValidation = z.object({
      id: z.string().length(9),
    });
  }

  validateCreationInput(input: Record<string, any>): IEmployeeCreationAttributes {
    return this.#creationInputValidation.parse(input);
  }

  validateUpdateInput(input: Record<string, any>): IEmployeeUpdateAttributes {
    return this.#updateInputValidation.parse(input);
  }

  validateDeleteInput(input: Record<string, any>): IEmployeeDeleteAttributes {
    return this.#deleteInputValidation.parse(input);
  }

  async getEmployees(cafe?: string) {
    const whereQuery: WhereOptions<Cafe> = {};
    if (cafe) {
      whereQuery["$cafeEmployee.cafe.name$"] = cafe;
    }
    const employees = await Employee.findAll({
      include: [
        {
          model: CafeEmployee,
          as: "cafeEmployee",
          include: [
            {
              model: Cafe,
              as: "cafe",
              attributes: ["name"],
            },
          ],
        },
      ],
      where: whereQuery,
      order: [
        [literal("CASE WHEN `cafeEmployee`.`start_date` IS NULL THEN 1 ELSE 0 END"), "ASC"],
        [{ model: CafeEmployee, as: "cafeEmployee" }, "start_date", "ASC"],
      ],
    });

    return employees.map(
      (employee) =>
        ({
          id: employee.id,
          name: employee.name,
          email_address: employee.email_address,
          phone_number: employee.phone_number,
          cafe: employee.cafeEmployee?.cafe?.name ?? "",
          days_worked: employee.cafeEmployee?.days_worked ?? 0,
        } as IEmployeeGetAttributes)
    );
  }

  async createEmployee(input: IEmployeeCreationAttributes) {
    return await Employee.sequelize?.transaction(async (transaction) => {
      const { cafeEmployee: cafeEmployeeInput, ...employeeInput } = input;
      const employee = await Employee.create(employeeInput, { transaction });
      let cafeEmployee = null;
      if (cafeEmployeeInput) {
        cafeEmployee = await CafeEmployee.create(
          {
            ...cafeEmployeeInput,
            employee_id: employee.id,
          },
          { transaction }
        );
      }
      return { ...employee.get({ plain: true }), cafeEmployee: cafeEmployee?.get({ plain: true }) ?? null };
    });
  }

  async updateEmployee(input: IEmployeeUpdateAttributes) {
    const { cafeEmployee: cafeEmployeeInput, ...employeeInput } = input;
    return await Employee.sequelize?.transaction(async (transaction) => {
      const employee = await Employee.findByPk(employeeInput.id, { transaction });
      if (!employee) {
        throw new CustomError(HttpStatus.NOT_FOUND, "Employee not found");
      }

      const cafeEmployee = await CafeEmployee.findByPk(employee.id, { transaction });
      if (cafeEmployeeInput) {
        if (cafeEmployee) {
          await cafeEmployee.update(cafeEmployeeInput, { transaction });
        } else {
          await CafeEmployee.create(
            {
              ...cafeEmployeeInput,
              employee_id: employee.id,
            },
            { transaction }
          );
        }
      } else if (cafeEmployee) {
        await cafeEmployee.destroy({ transaction });
      }
      await employee.update(employeeInput, { transaction });
    });
  }

  async deleteEmployee(input: IEmployeeDeleteAttributes) {
    const employee = await Employee.findByPk(input.id);
    if (!employee) {
      throw new CustomError(HttpStatus.NOT_FOUND, "Employee not found");
    }
    await employee.destroy();
  }
}

export default EmployeeService;
