const express = require("express");

const configMiddleware = (app) => {
  app.use(express.json());
};

module.exports = { configMiddleware };
