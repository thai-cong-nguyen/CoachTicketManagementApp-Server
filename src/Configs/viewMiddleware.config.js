const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const configMiddleware = (app) => {
  app.use(cors());
  app.use(express.json());
  app.use(cookieParser());
};

module.exports = { configMiddleware };
