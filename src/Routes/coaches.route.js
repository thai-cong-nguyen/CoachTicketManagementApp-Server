const express = require("express");
const router = express.Router();

const { verifyJWT } = require("../Middlewares/JWT.middleware");
const {
  uploadImageMiddleware,
} = require("../Middlewares/uploadImage.middleware");
const {
  createNewCoachController,
  getAllCoachesController,
  updateCoachController,
  deleteCoachController,
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
router.post("/", uploadImageMiddleware, createNewCoachController);
router.patch("/:coachId", uploadImageMiddleware, updateCoachController);
router.post("/:coachId", deleteCoachController);

module.exports = router;
