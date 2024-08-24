import { Op, WhereOptions } from "sequelize";
import database from "../../db";
import { Cafe, Employee } from "../../db/models";
import { z } from "zod";
import CafeEmployee from "../../db/models/cafe_employee";
import CustomError from "../../utils/error";
import { HttpStatus } from "@shared/constants/enums";
import { ICafeCreationAttributes, ICafeDeleteAttributes, ICafeUpdateAttributes } from "@shared/interfaces/ICafe";

class CafeService {
  #creationInputValidation;
  #updateInputValidation;
  #deleteInputValidation;

  constructor() {
    this.#creationInputValidation = z.object({
      name: z.string().trim().min(1).max(255),
      description: z.string().trim().min(1).max(255),
      logo: z.string().optional(),
      location: z.string().trim().min(1).max(255),
    });
    this.#updateInputValidation = this.#creationInputValidation.extend({
      id: z.string().uuid(),
    });
    this.#deleteInputValidation = z.object({
      id: z.string().uuid(),
    });
  }

  validateCreationInput(input: Record<string, any>): ICafeCreationAttributes {
    return this.#creationInputValidation.parse(input);
  }

  validateUpdateInput(input: Record<string, any>): ICafeUpdateAttributes {
    return this.#updateInputValidation.parse(input);
  }

  validateDeleteInput(input: Record<string, any>): ICafeDeleteAttributes {
    return this.#deleteInputValidation.parse(input);
  }

  async getCafes(location?: string) {
    const whereClause: WhereOptions<Cafe> = {};
    if (location) {
      whereClause.location = location;
    }
    const cafes = await Cafe.findAll({
      where: whereClause,
      include: [
        {
          model: CafeEmployee,
          as: "cafeEmployees",
        },
      ],
    });
    return cafes
      .sort((a, b) => (b.employees ?? 0) - (a.employees ?? 0))
      .map((cafe) => ({
        id: cafe.id,
        name: cafe.name,
        description: cafe.description,
        location: cafe.location,
        employees: cafe.employees,
      }));
  }

  async createCafe(input: ICafeCreationAttributes) {
    return await Cafe.create(input);
  }

  async updateCafe(input: ICafeUpdateAttributes) {
    const { id } = input;
    const cafe = await Cafe.findByPk(id);
    if (!cafe) {
      throw new CustomError(HttpStatus.NOT_FOUND, "Cafe not found");
    }

    await Cafe.update(input, { where: { id } });
  }

  async deleteCafe(input: ICafeDeleteAttributes) {
    const { id } = input;
    return await database.getInstance().transaction(async (transaction) => {
      const cafe = await Cafe.findByPk(id, {
        include: [
          {
            model: CafeEmployee,
            as: "cafeEmployees",
            attributes: ["employee_id"],
          },
        ],
        transaction,
      });
      if (!cafe) {
        throw new CustomError(HttpStatus.NOT_FOUND, "Cafe not found");
      }
      await Cafe.destroy({ where: { id }, transaction });
      if (cafe.cafeEmployees?.length) {
        await Employee.destroy({
          where: { id: { [Op.in]: cafe.cafeEmployees.map((cafeEmployee) => cafeEmployee.employee_id as string) } },
          transaction,
        });
      }
    });
  }
}

export default CafeService;
