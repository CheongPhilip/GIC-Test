import { literal, Op, WhereOptions } from "sequelize";
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
import { HttpStatus } from "@shared/constants/enums";
import { employeeValidationSchema } from "@shared/zodSchema/employee";

class EmployeeService {
  #creationInputValidation;
  #updateInputValidation;
  #deleteInputValidation;
  constructor() {
    this.#creationInputValidation = employeeValidationSchema.create;
    this.#updateInputValidation = employeeValidationSchema.update;
    this.#deleteInputValidation = employeeValidationSchema.delete;
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
      whereQuery["$cafeEmployee.cafe.name$"] = {
        [Op.like]: `%${cafe}%`,
      };
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
        }) as IEmployeeGetAttributes
    );
  }

  async getEmployeeById(id: string) {
    const employee = await Employee.findByPk(id, {
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
    });

    if (!employee) {
      throw new CustomError(HttpStatus.NOT_FOUND, "Employee not found");
    }

    return {
      id: employee.id,
      name: employee.name,
      email_address: employee.email_address,
      phone_number: employee.phone_number,
      cafe: employee.cafeEmployee?.cafe?.name ?? "",
      days_worked: employee.cafeEmployee?.days_worked ?? 0,
      cafe_id: employee.cafeEmployee?.cafe_id ?? null,
      gender: employee.gender,
    } as IEmployeeGetAttributes;
  }

  async createEmployee(input: IEmployeeCreationAttributes) {
    return await Employee.sequelize?.transaction(async (transaction) => {
      const { cafe_id, ...employeeInput } = input;
      const employee = await Employee.create(employeeInput, { transaction });
      let cafeEmployee = null;
      if (cafe_id) {
        cafeEmployee = await CafeEmployee.create(
          {
            cafe_id,
            employee_id: employee.id,
            start_date: new Date(),
          },
          { transaction }
        );
      }
      return { ...employee.get({ plain: true }), cafeEmployee: cafeEmployee?.get({ plain: true }) ?? null };
    });
  }

  async updateEmployee(input: IEmployeeUpdateAttributes) {
    const { cafe_id, ...employeeInput } = input;
    return await Employee.sequelize?.transaction(async (transaction) => {
      const employee = await Employee.findByPk(employeeInput.id, { transaction });
      if (!employee) {
        throw new CustomError(HttpStatus.NOT_FOUND, "Employee not found");
      }

      const cafeEmployee = await CafeEmployee.findByPk(employee.id, { transaction });
      if (cafe_id) {
        if (cafeEmployee) {
          if (cafeEmployee.cafe_id !== cafe_id) {
            await cafeEmployee.update(
              {
                cafe_id,
                start_date: new Date(),
              },
              { transaction }
            );
          }
        } else {
          await CafeEmployee.create(
            {
              cafe_id,
              employee_id: employee.id,
              start_date: new Date(),
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
