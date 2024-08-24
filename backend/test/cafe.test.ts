import supertest from "supertest";
import app from "../src/app";
import { Cafe, Employee } from "../src/db/models";
import CafeEmployee from "../src/db/models/cafe_employee";
import { Op } from "sequelize";
import { EGender, HttpStatus } from "../../shared/constants/enums";
import { ICafeCreationAttributes, ICafeUpdateAttributes } from "../../shared/interfaces/ICafe";

describe("CafeRouter", () => {
  afterAll(() => {
    app.close();
  });
  describe("GET /cafe", () => {
    let cafes: Cafe[];
    let employees: Employee[];
    let cafeEmployees: CafeEmployee[];
    let expectedOutputs: any[];
    beforeAll(async () => {
      cafes = await Cafe.bulkCreate([
        { name: "Cafe1", description: "Description1", location: "Location1" },
        { name: "Cafe2", description: "Description2", location: "Location2" },
        { name: "Cafe3", description: "Description3", location: "Location1" },
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
        {
          name: "John Doe6",
          email_address: "john_doe6@gmail.com",
          phone_number: "90909090",
          gender: EGender.FEMALE,
        },
      ]);
      cafeEmployees = await CafeEmployee.bulkCreate([
        { employee_id: employees[0].id, cafe_id: cafes[0].id, start_date: new Date() },
        { employee_id: employees[1].id, cafe_id: cafes[1].id, start_date: new Date() },
        { employee_id: employees[2].id, cafe_id: cafes[1].id, start_date: new Date() },
        { employee_id: employees[3].id, cafe_id: cafes[1].id, start_date: new Date() },
        { employee_id: employees[4].id, cafe_id: cafes[2].id, start_date: new Date() },
        { employee_id: employees[5].id, cafe_id: cafes[2].id, start_date: new Date() },
      ]);
      expectedOutputs = cafes
        .map((cafe) => ({
          id: cafe.id,
          name: cafe.name,
          description: cafe.description,
          location: cafe.location,
          employees: cafeEmployees.filter((ce) => ce.cafe_id === cafe.id).length,
        }))
        .sort((a, b) => b.employees - a.employees);
    });
    afterAll(async () => {
      await Employee.destroy({ where: {} });
      await Cafe.destroy({ where: {} });
    });
    it("should return all cafes with employees count", async () => {
      const response = await supertest(app).get("/cafe");
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.data).toEqual(expectedOutputs);
    });
    it("should return cafe with employees count for a specific location", async () => {
      const _expectedOutputs = expectedOutputs.filter((cafe) => cafe.location === "Location2");
      const response = await supertest(app).get("/cafe?location=Location2");
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.data).toEqual(_expectedOutputs);
    });
    it("should return empty array if location is not found", async () => {
      const response = await supertest(app).get("/cafe?location=InvalidLocation");
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.data).toEqual([]);
    });
  });

  describe("POST /cafe", () => {
    beforeAll(async () => {
      await Cafe.bulkCreate([{ name: "Cafe100", description: "Description100", location: "Location100" }]);
    });
    afterAll(async () => {
      await Employee.destroy({ where: {} });
      await Cafe.destroy({ where: {} });
    });
    it("should create a new cafe", async () => {
      const input = { name: "Cafe1", description: "Description1", location: "Location1" } as ICafeCreationAttributes;
      const response = await supertest(app).post("/cafe").send(input);
      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body.data).toMatchObject(input);
    });
    it("should return error if fields is invalid", async () => {
      const input = { name: "", description: "", location: "" } as ICafeCreationAttributes;
      const response = await supertest(app).post("/cafe").send(input);
      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      expect(response.body.errors).toEqual([
        {
          code: "too_small",
          minimum: 1,
          type: "string",
          inclusive: true,
          exact: false,
          message: "String must contain at least 1 character(s)",
          path: ["name"],
        },
        {
          code: "too_small",
          minimum: 1,
          type: "string",
          inclusive: true,
          exact: false,
          message: "String must contain at least 1 character(s)",
          path: ["description"],
        },
        {
          code: "too_small",
          minimum: 1,
          type: "string",
          inclusive: true,
          exact: false,
          message: "String must contain at least 1 character(s)",
          path: ["location"],
        },
      ]);
    });

    it("should return error if name is not unique", async () => {
      const input = { name: "Cafe100", description: "Description1", location: "Location1" } as ICafeCreationAttributes;
      await supertest(app).post("/cafe").send(input);
      const response = await supertest(app).post("/cafe").send(input);
      expect(response.status).toBe(HttpStatus.CONFLICT);
      expect(response.body.errors).toEqual('Duplicated unique value: {\n  "cafes_name": "Cafe100"\n}');
    });
  });

  describe("PUT /cafe", () => {
    let cafe: Cafe;
    beforeAll(async () => {
      cafe = await Cafe.create({ name: "Cafe1", description: "Description1", location: "Location1" });
    });
    afterAll(async () => {
      await Cafe.destroy({ where: {} });
    });
    it("should update a cafe accordingly", async () => {
      const input = { id: cafe.id, name: "Cafe2", description: "Description2", location: "Location2" } as ICafeUpdateAttributes;
      const response = await supertest(app).put("/cafe").send(input);
      expect(response.status).toBe(HttpStatus.UPDATED);
      const updatedCafe = await Cafe.findByPk(cafe.id, { raw: true });
      expect(updatedCafe).toMatchObject(input);
    });
    it("should return error if fields is invalid", async () => {
      const input = { id: cafe.id, name: "", description: "", location: "" } as ICafeUpdateAttributes;
      const response = await supertest(app).put("/cafe").send(input);
      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      expect(response.body.errors).toEqual([
        {
          code: "too_small",
          minimum: 1,
          type: "string",
          inclusive: true,
          exact: false,
          message: "String must contain at least 1 character(s)",
          path: ["name"],
        },
        {
          code: "too_small",
          minimum: 1,
          type: "string",
          inclusive: true,
          exact: false,
          message: "String must contain at least 1 character(s)",
          path: ["description"],
        },
        {
          code: "too_small",
          minimum: 1,
          type: "string",
          inclusive: true,
          exact: false,
          message: "String must contain at least 1 character(s)",
          path: ["location"],
        },
      ]);
    });
    it("should return error if cafe is not found", async () => {
      const input = {
        id: "123e4567-e89b-12d3-a456-426614174000",
        name: "Cafe2",
        description: "Description2",
        location: "Location2",
      } as ICafeUpdateAttributes;
      const response = await supertest(app).put("/cafe").send(input);
      expect(response.status).toBe(HttpStatus.NOT_FOUND);
      expect(response.body.errors).toEqual("Cafe not found");
    });
  });

  describe("DELETE /cafe", () => {
    let cafes: Cafe[];
    let employees: Employee[];
    let cafeEmployees: CafeEmployee[];
    beforeAll(async () => {
      cafes = await Cafe.bulkCreate([
        { name: "Cafe100", description: "Description100", location: "Location100" },
        { name: "Cafe101", description: "Description101", location: "Location101" },
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
      ]);
      cafeEmployees = await CafeEmployee.bulkCreate([
        { employee_id: employees[0].id, cafe_id: cafes[0].id, start_date: new Date() },
        { employee_id: employees[1].id, cafe_id: cafes[0].id, start_date: new Date() },
        { employee_id: employees[2].id, cafe_id: cafes[1].id, start_date: new Date() },
      ]);
    });
    afterAll(async () => {
      await Employee.destroy({ where: {} });
      await Cafe.destroy({ where: {} });
    });

    it("should delete a cafe and its employess accordingly", async () => {
      const input = { id: cafes[0].id };
      const response = await supertest(app).delete("/cafe").send(input);
      expect(response.status).toBe(HttpStatus.UPDATED);
      const cafe = await Cafe.findByPk(input.id);
      expect(cafe).toBeNull();
      const cafeEmployee = await CafeEmployee.findAll({ where: { cafe_id: input.id } });
      expect(cafeEmployee).toHaveLength(0);
      const employees = await Employee.findAll({
        where: { id: { [Op.in]: cafeEmployees.filter((ce) => ce.cafe_id === cafes[0].id).map((ce) => ce.employee_id) } },
      });
      expect(employees).toHaveLength(0);
    });
    it("should return error if cafe is not found", async () => {
      const input = { id: "123e4567-e89b-12d3-a456-426614174000" };
      const response = await supertest(app).delete("/cafe").send(input);
      expect(response.status).toBe(HttpStatus.NOT_FOUND);
      expect(response.body.errors).toEqual("Cafe not found");
    });
  });
});
