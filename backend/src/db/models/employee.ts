import { DataTypes, CreationOptional, InferAttributes, InferCreationAttributes, Model, Sequelize } from "sequelize";
import { generateRandomId } from "../../utils/random";
import CafeEmployee from "./cafe_employee";
import { EGender } from "@shared/constants/enums";

class Employee extends Model<InferAttributes<Employee>, InferCreationAttributes<Employee>> {
  declare id: CreationOptional<string>;
  declare name: string;
  declare email_address: string;
  declare phone_number: string;
  declare gender: EGender;

  declare cafeEmployee?: Pick<CafeEmployee, "employee_id" | "cafe_id" | "start_date" | "cafe" | "employees" | "days_worked"> | null;

  static associate() {
    this.hasOne(CafeEmployee, {
      foreignKey: "employee_id",
      as: "cafeEmployee",
      onDelete: "CASCADE",
    });
  }
}

export const initEmployee = (sequelize: Sequelize) => {
  Employee.init(
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        defaultValue: generateRandomId,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [1, 255],
            msg: "Name length must be between 1 and 255",
          },
        },
      },
      email_address: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail: {
            msg: "Invalid email address",
          },
        },
      },
      phone_number: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          is: {
            args: [/^[8|9]\d+$/],
            msg: "Invalid phone number",
          },
        },
      },
      gender: {
        type: DataTypes.ENUM,
        values: Object.values(EGender),
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "employees",
      indexes: [
        {
          unique: true,
          fields: ["email_address"],
        },
      ],
    }
  );
};

export default Employee;
