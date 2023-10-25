const express = require("express");
const router = express.Router();
const {
  getAllRoutesController,
  createNewRouteController,
  updateRouteController,
  deleteRouteController,
} = require("../Controllers/route.controller");
const { verifyJWT } = require("../Middlewares/JWT.middleware");
const { isAdmin } = require("../Middlewares/verifyRoles.middleware");

router.use(verifyJWT);
router.get("/", getAllRoutesController);
router.use(isAdmin);
router.post("/", createNewRouteController);
router.post("/:id", updateRouteController);
router.delete("/:id", deleteRouteController);

module.exports = router;
