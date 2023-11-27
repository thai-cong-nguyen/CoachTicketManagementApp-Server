const express = require("express");
const router = express.Router();
const {
  getAllServicesController,
  createNewServiceController,
  removeServiceOutOfCoachController,
  addServiceForCoachController,
} = require("../Controllers/service.controller");

const { verifyJWT } = require("../Middlewares/JWT.middleware");
const { isAdmin } = require("../Middlewares/verifyRoles.middleware");

router.use(verifyJWT);
router.use(isAdmin);
router.get("/", getAllServicesController);
router.post("/", createNewServiceController);
router.delete("/coaches", removeServiceOutOfCoachController);
router.post("/coaches", addServiceForCoachController);

module.exports = router;
