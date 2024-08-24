import { Model, InferAttributes, InferCreationAttributes, DataTypes, Sequelize, ForeignKey, NonAttribute } from "sequelize";
import Employee from "./employee";
import Cafe from "./cafe";

class CafeEmployee extends Model<InferAttributes<CafeEmployee>, InferCreationAttributes<CafeEmployee>> {
  declare employee_id: ForeignKey<string>;
  declare cafe_id: ForeignKey<string>;
  declare start_date: Date;

  // Associations
  declare cafe?: NonAttribute<Cafe>;
  declare employees?: NonAttribute<Employee[]>;

  // Virtual field
  declare days_worked?: number;

  static associate() {
    this.belongsTo(Cafe, {
      foreignKey: "cafe_id",
      as: "cafe",
      onDelete: "CASCADE",
    });
    this.belongsTo(Employee, {
      foreignKey: "employee_id",
      as: "employees",
      onDelete: "CASCADE",
    });
  }
}

export const initCafeEmployee = (sequelize: Sequelize) => {
  CafeEmployee.init(
    {
      employee_id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      cafe_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      start_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      days_worked: {
        type: DataTypes.VIRTUAL(DataTypes.INTEGER),
        get() {
          return Math.floor((new Date().getTime() - this.start_date.getTime()) / (1000 * 60 * 60 * 24));
        },
      },
    },
    {
      sequelize,
      modelName: "CafeEmployee",
      tableName: "cafe_employee",
      timestamps: false,
      indexes: [
        {
          fields: ["cafe_id"],
        },
      ],
    }
  );
};

export default CafeEmployee;
