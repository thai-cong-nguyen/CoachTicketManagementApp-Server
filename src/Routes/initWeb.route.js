const express = require("express");
const router = express.Router();

const initWebRoutes = (app) => {
  router.get("/", (req, res, next) => {
    return res.status(404).send("404 Not Found");
  });

  return app.use("/", router);
};

module.exports = { initWebRoutes };
