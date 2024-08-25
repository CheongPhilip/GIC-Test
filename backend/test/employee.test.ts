import supertest from "supertest";
import app from "../src/app";
import { Cafe, Employee } from "../src/db/models";
import CafeEmployee from "../src/db/models/cafe_employee";
import { EGender, HttpStatus } from "../../shared/constants/enums";
import { IEmployeeCreationAttributes, IEmployeeUpdateAttributes } from "../../shared/interfaces/IEmployee";

describe("EmployeeRouter", () => {
  afterAll(() => {
    app.close();
  });
  describe("GET /employee", () => {
    let cafes: Cafe[];
    let employees: Employee[];
    let cafeEmployees: CafeEmployee[];
    let expectedOutput: any[];
    beforeAll(async () => {
      cafes = await Cafe.bulkCreate([
        { name: "Cafe111", description: "two employees", location: "Location1" },
        { name: "Cafe222", description: "one employees", location: "Location2" },
        { name: "Cafe333", description: "one employees", location: "Location3" },
      ]);
      employees = await Employee.bulkCreate([
        {
          name: "John Doe",
          email_address: "john_doe@gmail.com",
          phone_number: "80808080",
          gender: EGender.MALE,
        },
        {
          name: "John Doe2",
          email_address: "john_doe2@gmail.com",
          phone_number: "80808081",
          gender: EGender.FEMALE,
        },
        {
          name: "John Doe3",
          email_address: "john_doe3@gmail.com",
          phone_number: "80808083",
          gender: EGender.MALE,
        },
        {
          name: "John Doe4",
          email_address: "john_doe4@gmail.com",
          phone_number: "90909090",
          gender: EGender.FEMALE,
        },
        {
          name: "John Doe5",
          email_address: "john_doe5@gmail.com",
          phone_number: "90909090",
          gender: EGender.FEMALE,
        },
      ]);
      cafeEmployees = await CafeEmployee.bulkCreate([
        {
          cafe_id: cafes[0].id,
          employee_id: employees[0].id,
          start_date: new Date("2022-04-23"),
        },
        {
          cafe_id: cafes[0].id,
          employee_id: employees[1].id,
          start_date: new Date("2022-02-01"),
        },
        {
          cafe_id: cafes[1].id,
          employee_id: employees[2].id,
          start_date: new Date("2022-11-01"),
        },
        {
          cafe_id: cafes[2].id,
          employee_id: employees[3].id,
          start_date: new Date("2022-04-01"),
        },
      ]);
      expectedOutput = cafeEmployees
        .sort((a, b) => a.start_date.getTime() - b.start_date.getTime())
        .map((_cafeEmployee) => {
          const _employee = employees.find((e) => e.id === _cafeEmployee.employee_id);
          if (!_employee) {
            throw new Error("Employee not found on initilzation");
          }
          return {
            id: _employee?.id,
            name: _employee.name,
            email_address: _employee.email_address,
            phone_number: _employee.phone_number,
            cafe: cafes.find((c) => c.id === _cafeEmployee.cafe_id)?.name ?? "",
            days_worked: _cafeEmployee.days_worked,
          };
        });
      employees.forEach((employee) => {
        const cafeEmployee = cafeEmployees.find((ce) => ce.employee_id === employee.id);
        if (!cafeEmployee) {
          expectedOutput.push({
            id: employee.id,
            name: employee.name,
            email_address: employee.email_address,
            phone_number: employee.phone_number,
            cafe: "",
            days_worked: 0,
          });
        }
      });
    });
    afterAll(async () => {
      await Employee.destroy({ where: {} });
      await Cafe.destroy({ where: {} });
    });
    it("should return all employees sorted by days_worked if no cafe is provided", async () => {
      const response = await supertest(app).get("/employee");
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.data.length).toBe(5);
      expect(response.body.data).toEqual(expectedOutput);
    });
    it("should return the employees for a cafe sorted by day_worked descending", async () => {
      const cafe = cafes[0];
      const _expectedOutput = expectedOutput.filter((e) => e.cafe === cafe.name);

      const response = await supertest(app).get(`/employee?cafe=${cafe.name}`);
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.data.length).toBe(2);
      expect(response.body.data).toEqual(_expectedOutput);
    });
    it("should return an empty array if the cafe does not exist", async () => {
      const response = await supertest(app).get("/employee?cafe=NonExistentCafe");
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.data).toEqual([]);
    });
  });

  describe("GET /employee/:id", () => {
    let cafes: Cafe[];
    let employees: Employee[];
    let cafeEmployees: CafeEmployee[];
    let expectedOutput: any[];
    beforeAll(async () => {
      cafes = await Cafe.bulkCreate([
        { name: "Cafe111", description: "two employees", location: "Location1" },
        { name: "Cafe222", description: "one employees", location: "Location2" },
        { name: "Cafe333", description: "one employees", location: "Location3" },
      ]);
      employees = await Employee.bulkCreate([
        {
          name: "John Doe",
          email_address: "john_doe@gmail.com",
          phone_number: "80808080",
          gender: EGender.MALE,
        },
        {
          name: "John Doe2",
          email_address: "john_doe2@gmail.com",
          phone_number: "80808081",
          gender: EGender.FEMALE,
        },
        {
          name: "John Doe3",
          email_address: "john_doe3@gmail.com",
          phone_number: "80808083",
          gender: EGender.MALE,
        },
        {
          name: "John Doe4",
          email_address: "john_doe4@gmail.com",
          phone_number: "90909090",
          gender: EGender.FEMALE,
        },
        {
          name: "John Doe5",
          email_address: "john_doe5@gmail.com",
          phone_number: "90909090",
          gender: EGender.FEMALE,
        },
      ]);
      cafeEmployees = await CafeEmployee.bulkCreate([
        {
          cafe_id: cafes[0].id,
          employee_id: employees[0].id,
          start_date: new Date("2022-04-23"),
        },
        {
          cafe_id: cafes[0].id,
          employee_id: employees[1].id,
          start_date: new Date("2022-02-01"),
        },
        {
          cafe_id: cafes[1].id,
          employee_id: employees[2].id,
          start_date: new Date("2022-11-01"),
        },
        {
          cafe_id: cafes[2].id,
          employee_id: employees[3].id,
          start_date: new Date("2022-04-01"),
        },
      ]);
      expectedOutput = cafeEmployees
        .sort((a, b) => a.start_date.getTime() - b.start_date.getTime())
        .map((_cafeEmployee) => {
          const _employee = employees.find((e) => e.id === _cafeEmployee.employee_id);
          if (!_employee) {
            throw new Error("Employee not found on initilzation");
          }
          return {
            id: _employee?.id,
            name: _employee.name,
            email_address: _employee.email_address,
            phone_number: _employee.phone_number,
            cafe: cafes.find((c) => c.id === _cafeEmployee.cafe_id)?.name ?? "",
            days_worked: _cafeEmployee.days_worked,
          };
        });
      employees.forEach((employee) => {
        const cafeEmployee = cafeEmployees.find((ce) => ce.employee_id === employee.id);
        if (!cafeEmployee) {
          expectedOutput.push({
            id: employee.id,
            name: employee.name,
            email_address: employee.email_address,
            phone_number: employee.phone_number,
            cafe: "",
            days_worked: 0,
          });
        }
      });
    });
    afterAll(async () => {
      await Employee.destroy({ where: {} });
      await Cafe.destroy({ where: {} });
    });
    it("should return the employee details", async () => {
      const employee = employees[0];
      const cafeEmployee = cafeEmployees.find((ce) => ce.employee_id === employee.id);
      const expectedOutput = {
        id: employee.id,
        name: employee.name,
        email_address: employee.email_address,
        phone_number: employee.phone_number,
        gender: employee.gender,
        cafe: cafes.find((c) => c.id === cafeEmployee?.cafe_id)?.name ?? "",
        days_worked: cafeEmployee?.days_worked ?? 0,
        cafe_id: cafeEmployee?.cafe_id,
      };
      const response = await supertest(app).get(`/employee/${employee.id}`);
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.data).toEqual(expectedOutput);
    });
    it("should return an error if the employee does not exist", async () => {
      const response = await supertest(app).get(`/employee/0bdd3575-988e-4f33-a620-8b108e794fc0`);
      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });
  });

  describe("POST /employee", () => {
    let cafe: Cafe;
    beforeAll(async () => {
      cafe = await Cafe.create({ name: "Cafe111", description: "Decsription1", location: "Location1" });
    });
    afterAll(async () => {
      await Employee.destroy({ where: {} });
      await Cafe.destroy({ where: {} });
    });
    it("should allow to add employee without cafe_id and start_date", async () => {
      const input = {
        name: "John Doe",
        email_address: "john_doe1@gmail.com",
        phone_number: "80808080",
        gender: EGender.MALE,
        cafeEmployee: null,
      } as IEmployeeCreationAttributes;
      const response = await supertest(app).post("/employee").send(input);
      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body.data).toMatchObject(input);
    });
    it("should allow to add employee with cafe_id and update start_date", async () => {
      const input = {
        name: "John Doe2",
        email_address: "john_doe2@gmail.com",
        phone_number: "80808080",
        gender: EGender.FEMALE,
        cafe_id: cafe.id,
      } as IEmployeeCreationAttributes;
      const response = await supertest(app).post("/employee").send(input);
      expect(response.status).toBe(HttpStatus.CREATED);
      const createdEmployee = await Employee.findByPk(response.body.data.id, { include: [{ model: CafeEmployee, as: "cafeEmployee" }] });
      expect(createdEmployee?.name).toBe(input.name);
      expect(createdEmployee?.email_address).toBe(input.email_address);
      expect(createdEmployee?.phone_number).toBe(input.phone_number);
      expect(createdEmployee?.gender).toBe(input.gender);
      expect(createdEmployee?.cafeEmployee?.cafe_id).toBe(input.cafe_id);
    });
    it("should return an error if the cafe does not exist", async () => {
      const input = {
        name: "John Doe",
        email_address: "john_doe@gmail.com",
        phone_number: "80808080",
        gender: EGender.FEMALE,
        cafe_id: "0bdd3575-988e-4f33-a620-8b108e794fc0",
      } as IEmployeeCreationAttributes;
      const response = await supertest(app).post("/employee").send(input);
      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      expect(response.body.errors).toBe("Foreign key constraint error");
    });
    it("should return an error if the input fields is invalid", async () => {
      const input = {
        name: "",
        email_address: "abc",
        phone_number: "abc",
        gender: "abc",
        cafeEmployee: {
          cafe_id: "abc",
          start_date: "abc",
        },
      };
      const response = await supertest(app).post("/employee").send(input);
      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      expect(response.body.errors).toEqual([
        {
          code: "too_small",
          minimum: 6,
          type: "string",
          inclusive: true,
          exact: false,
          message: "String must contain at least 6 character(s)",
          path: ["name"],
        },
        {
          validation: "email",
          code: "invalid_string",
          message: "Invalid email",
          path: ["email_address"],
        },
        {
          code: "too_small",
          minimum: 8,
          type: "string",
          inclusive: true,
          exact: true,
          message: "String must contain exactly 8 character(s)",
          path: ["phone_number"],
        },
        {
          validation: "regex",
          code: "invalid_string",
          message: "Invalid",
          path: ["phone_number"],
        },
        {
          received: "abc",
          code: "invalid_enum_value",
          options: ["male", "female"],
          path: ["gender"],
          message: "Invalid enum value. Expected 'male' | 'female', received 'abc'",
        },
      ]);
    });
  });

  describe("PUT /employee", () => {
    let cafes: Cafe[];
    let employees: Employee[];
    beforeAll(async () => {
      cafes = await Cafe.bulkCreate([
        { name: "Cafe111", description: "Decsription1", location: "Location1" },
        { name: "Cafe222", description: "Decsription2", location: "Location2" },
      ]);
      employees = await Employee.bulkCreate([
        {
          name: "John Doe",
          email_address: "john_doe@gmail.com",
          phone_number: "80808080",
          gender: EGender.MALE,
        },
        {
          name: "John Doe 2",
          email_address: "john_doe2@gmail.com",
          phone_number: "80808080",
          gender: EGender.MALE,
        },
      ]);
      await CafeEmployee.bulkCreate([
        {
          cafe_id: cafes[0].id,
          employee_id: employees[0].id,
          start_date: new Date("2022-01-01"),
        },
        {
          cafe_id: cafes[1].id,
          employee_id: employees[1].id,
          start_date: new Date("2022-02-01"),
        },
      ]);
    });
    afterAll(async () => {
      await Employee.destroy({ where: {} });
      await Cafe.destroy({ where: {} });
    });
    it("should allow to unassign employee from a cafe_id and start_date", async () => {
      const employee = employees[0];
      const input = {
        id: employee.id,
        name: "John Doe",
        email_address: "john_doe1@gmail.com",
        phone_number: "80808080",
        gender: EGender.MALE,
        cafeEmployee: null,
      } as IEmployeeUpdateAttributes;
      const response = await supertest(app).put("/employee").send(input);
      expect(response.status).toBe(HttpStatus.UPDATED);
      const updatedEmployee = await Employee.findByPk(employee.id, { include: [{ model: CafeEmployee, as: "cafeEmployee" }] });
      expect(updatedEmployee).toMatchObject(input);
    });
    it("should allow to update employee details", async () => {
      const employee = employees[0];
      const cafe = cafes[1];
      const input = {
        id: employee.id,
        name: "John Doe3",
        email_address: "john_doe3@gmail.com",
        phone_number: "80808080",
        gender: EGender.FEMALE,
        cafe_id: cafe.id,
      } as IEmployeeUpdateAttributes;
      const response = await supertest(app).put("/employee").send(input);
      expect(response.status).toBe(HttpStatus.UPDATED);
      const updatedEmployee = await Employee.findByPk(employee.id, { include: [{ model: CafeEmployee, as: "cafeEmployee" }] });
      expect(updatedEmployee?.name).toBe(input.name);
      expect(updatedEmployee?.email_address).toBe(input.email_address);
      expect(updatedEmployee?.phone_number).toBe(input.phone_number);
      expect(updatedEmployee?.gender).toBe(input.gender);
      expect(updatedEmployee?.cafeEmployee?.cafe_id).toBe(input.cafe_id);
    });
    it("should return an error if the cafe does not exist", async () => {
      const employee = employees[0];
      const input = {
        id: employee.id,
        name: "John Doe",
        email_address: "john_doe@gmail.com",
        phone_number: "80808080",
        gender: EGender.FEMALE,
        cafe_id: "0bdd3575-988e-4f33-a620-8b108e794fc0",
      } as IEmployeeUpdateAttributes;
      const response = await supertest(app).put("/employee").send(input);
      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      expect(response.body.errors).toBe("Foreign key constraint error");
    });
    it("should return an error if the input fields is invalid", async () => {
      const employee = employees[0];
      const input = {
        id: employee.id,
        name: "",
        email_address: "abc",
        phone_number: "abc",
        gender: "abc",
        cafe_id: "abc",
      };
      const response = await supertest(app).put("/employee").send(input);
      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      expect(response.body.errors).toEqual([
        {
          code: "too_small",
          minimum: 6,
          type: "string",
          inclusive: true,
          exact: false,
          message: "String must contain at least 6 character(s)",
          path: ["name"],
        },
        {
          validation: "email",
          code: "invalid_string",
          message: "Invalid email",
          path: ["email_address"],
        },
        {
          code: "too_small",
          minimum: 8,
          type: "string",
          inclusive: true,
          exact: true,
          message: "String must contain exactly 8 character(s)",
          path: ["phone_number"],
        },
        {
          validation: "regex",
          code: "invalid_string",
          message: "Invalid",
          path: ["phone_number"],
        },
        {
          received: "abc",
          code: "invalid_enum_value",
          options: ["male", "female"],
          path: ["gender"],
          message: "Invalid enum value. Expected 'male' | 'female', received 'abc'",
        },
        {
          validation: "uuid",
          code: "invalid_string",
          message: "Invalid uuid",
          path: ["cafe_id"],
        },
      ]);
    });
    it("should return an error if the employee does not exist", async () => {
      const cafe = cafes[0];
      const input = {
        id: "InvalidId",
        name: "John Doe",
        email_address: "john_doe@gmail.com",
        phone_number: "80808080",
        gender: EGender.FEMALE,
        cafe_id: cafe.id,
      };
      const response = await supertest(app).put("/employee").send(input);
      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });
    it("should return an error if the email is already exists", async () => {
      const employee = employees[0];
      const employee2 = employees[1];
      const cafe = cafes[0];
      const input = {
        id: employee.id,
        name: "John Doe",
        email_address: employee2.email_address,
        phone_number: "80808080",
        gender: EGender.FEMALE,
        cafe_id: cafe.id,
      };
      const response = await supertest(app).put("/employee").send(input);
      expect(response.status).toBe(HttpStatus.CONFLICT);
      expect(response.body.errors).toBe('Duplicated unique value: {\n  "employees_email_address": "john_doe2@gmail.com"\n}');
    });
  });

  describe("DELETE /employee", () => {
    let cafe: Cafe;
    let employees: Employee[];
    let cafeEmployees: CafeEmployee[];
    beforeAll(async () => {
      cafe = await Cafe.create({ name: "Cafe111", description: "Decsription1", location: "Location1" });
      employees = await Employee.bulkCreate([
        {
          name: "John Doe",
          email_address: "john_doe@gmail.com",
          phone_number: "80808080",
          gender: EGender.MALE,
        },
        {
          name: "John Doe 2",
          email_address: "john_doe2@gmail.com",
          phone_number: "80808080",
          gender: EGender.MALE,
        },
      ]);
      cafeEmployees = await CafeEmployee.bulkCreate([
        {
          cafe_id: cafe.id,
          employee_id: employees[0].id,
          start_date: new Date("2022-01-01"),
        },
        {
          cafe_id: cafe.id,
          employee_id: employees[1].id,
          start_date: new Date("2022-02-01"),
        },
      ]);
    });
    afterAll(async () => {
      await Employee.destroy({ where: {} });
      await Cafe.destroy({ where: {} });
    });
    it("should allow to delete employee", async () => {
      const employee = employees[0];
      const currentEmployee = await Employee.findByPk(employee.id);
      expect(currentEmployee).not.toBeNull();
      const currentCafeEmployee = await CafeEmployee.findByPk(employee.id);
      expect(currentCafeEmployee).not.toBeNull();
      const response = await supertest(app).delete(`/employee`).send({ id: employee.id });
      expect(response.status).toBe(HttpStatus.UPDATED);
      const deletedEmployee = await Employee.findByPk(employee.id);
      expect(deletedEmployee).toBeNull();
      const cafeEmployee = await CafeEmployee.findByPk(employee.id);
      expect(cafeEmployee).toBeNull();
    });
    it("should return an error if the employee does not exist", async () => {
      const response = await supertest(app).delete(`/employee`).send({ id: "InvalidId" });
      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });
  });
});
