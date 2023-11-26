const express = require("express");
const router = express.Router();

const { verifyJWT } = require("../Middlewares/JWT.middleware");

const {
  getAllCoachTypesController,
  createNewCoachTypesController,
} = require("../Controllers/coachTypes.controller");

const {
  isAdmin,
  isStaff,
  isAdminOrStaff,
} = require("../Middlewares/verifyRoles.middleware");

router.use(verifyJWT);
router.use(isAdmin);
router.get("/", getAllCoachTypesController);
router.post("/", createNewCoachTypesController);

module.exports = router;
