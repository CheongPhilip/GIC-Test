import Employee, { initEmployee } from "./employee";
import Cafe, { initCafe } from "./cafe";
import { Sequelize } from "sequelize";
import CafeEmployee, { initCafeEmployee } from "./cafe_employee";

const initModels = (sequelize: Sequelize) => {
  initCafe(sequelize);
  initEmployee(sequelize);
  initCafeEmployee(sequelize);
};

const buildAssociations = () => {
  Cafe.associate();
  Employee.associate();
  CafeEmployee.associate();
};

const syncModels = async () => {
  await Cafe.sync();
  await Employee.sync();
  await CafeEmployee.sync();
};

const initializeModels = async (sequelize: Sequelize) => {
  initModels(sequelize);
  buildAssociations();
  await syncModels();
};

export { initializeModels, Employee, Cafe };
