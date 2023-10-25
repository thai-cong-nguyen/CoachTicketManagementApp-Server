const express = require("express");
const router = express.Router();

const { verifyJWT } = require("../Middlewares/JWT.middleware");
const {
  createNewCoachController,
  getAllCoachesController,
} = require("../Controllers/coach.controller");
const {
  isAdmin,
  isStaff,
  isManager,
  isAdminOrStaff,
} = require("../Middlewares/verifyRoles.middleware");

router.use(verifyJWT);
router.use(isAdmin);
router.get("/", getAllCoachesController);
router.post("/", createNewCoachController);

module.exports = router;
