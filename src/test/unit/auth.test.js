const chai = require("chai");
const sinon = require("sinon");
const authController = require("../../Controllers/auth.controller");

var expect = chai.expect;

describe("Auth Controller", () => {
  describe("login", () => {
    it("should return a token when valid credentials are provided", async () => {
      // Mock the request and response objects
      const req = {
        body: {
          username: "testuser",
          password: "testpassword",
        },
      };
      const res = {
        json: sinon.spy(),
      };

      // Call the login function
      await authController.loginNewUserAccountController(req, res);

      // Assert that the response contains a token
      expect(res.json.calledOnce).to.be.true;
      expect(res.json.firstCall.args[0]).to.have.property("token");
    });

    it("should return an error when invalid credentials are provided", async () => {
      // Mock the request and response objects
      const req = {
        body: {
          username: "invaliduser",
          password: "invalidpassword",
        },
      };
      const res = {
        json: sinon.spy(),
      };

      // Call the login function
      await authController.loginNewUserAccountController(req, res);

      // Assert that the response contains an error message
      expect(res.json.calledOnce).to.be.true;
      expect(res.json.firstCall.args[0]).to.have.property("error");
    });
  });
  describe("register", () => {
    it("should return a success message when valid user data is provided", async () => {
      // Mock the request and response objects
      const req = {
        body: {
          username: "testuser",
          password: "testpassword",
          email: "testuser@example.com",
        },
      };
      const res = {
        json: sinon.spy(),
      };

      // Call the register function
      authController.registerNewUserAccountController(req, res);

      // Assert that the response contains a success message
      expect(res.json.calledOnce).to.be.true;
      expect(res.json.firstCall.args[0]).to.have.property("message");
      expect(res.json.firstCall.args[0].message).to.equal(
        "User registered successfully"
      );
    });

    it("should return an error when invalid user data is provided", async () => {
      // Mock the request and response objects
      const req = {
        body: {
          username: "testuser",
          password: "testpassword",
          email: "invalidemail",
        },
      };
      const res = {
        json: sinon.spy(),
      };

      // Call the register function
      authController.registerNewUserAccountController(req, res);

      // Assert that the response contains an error message
      expect(res.json.calledOnce).to.be.true;
      expect(res.json.firstCall.args[0]).to.have.property("error");
    });
  });
});
