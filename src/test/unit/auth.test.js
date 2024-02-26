const { expect } = require("chai");
const sinon = require("sinon");
const {
  sequelize,
  dataTypes,
  checkModelName,
  checkUniqueIndex,
  checkPropertyExists,
  makeMockModels,
} = require("sequelize-test-helpers");
const superTest = require("supertest");
// const apiWebRoutes = require("../utils/server.testUtils");
const app = require("../../../server");

const authController = require("../../Controllers/auth.controller");

const UserAccountModel = require("../../Models/useraccount");

describe("Auth Controller", () => {
  describe("login", () => {
    it("should return a token when valid credentials are provided", async () => {
      // Mock the request and response objects
      const req = {
        userName: "admin",
        password: "123456789",
      };

      // Call the login function
      const res = await superTest(app).post("/api/auth/login").send(req);

      // Expecting a 200 status code
      expect(res.res.statusCode).to.equal(200);
      // Expecting message to be "Login Successfully"
      expect(res.body.message).to.equal("Login Successfully");
      // Expecting a token to be returned
      // expect(res.body.data.access_token).to.equal();
    });

    it("should return an error when invalid credentials are provided", async () => {});
  });
  describe("register", () => {
    it("should return a success message when valid user data is provided", async () => {});

    it("should return an error when invalid user data is provided", async () => {});
  });
});
