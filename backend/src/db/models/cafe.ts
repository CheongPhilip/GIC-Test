import { DataTypes, CreationOptional, InferAttributes, InferCreationAttributes, Model, Sequelize } from "sequelize";
import { v4 as UuidV4 } from "uuid";
import CafeEmployee from "./cafe_employee";

class Cafe extends Model<InferAttributes<Cafe>, InferCreationAttributes<Cafe>> {
  declare id: CreationOptional<string>;
  declare name: string;
  declare description: string;
  declare logo?: string | null;
  declare location: string;

  declare cafeEmployees?: Partial<CafeEmployee>[] | null;

  // Virtual field
  declare employees?: number;

  static associate() {
    this.hasMany(CafeEmployee, {
      foreignKey: "cafe_id",
      onDelete: "CASCADE",
      as: "cafeEmployees",
    });
  }
}

export const initCafe = (sequelize: Sequelize) => {
  Cafe.init(
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        defaultValue: UuidV4,
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
      description: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [1, 255],
            msg: "Description length must be between 1 and 255",
          },
        },
      },
      logo: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [1, 255],
            msg: "Location length must be between 1 and 255",
          },
        },
      },
      employees: {
        type: DataTypes.VIRTUAL(DataTypes.INTEGER),
        get() {
          return this.cafeEmployees?.length ?? 0;
        },
      },
    },
    {
      sequelize,
      tableName: "cafes",
      indexes: [
        {
          unique: true,
          fields: ["name"],
        },
      ],
    }
  );
};

export default Cafe;
