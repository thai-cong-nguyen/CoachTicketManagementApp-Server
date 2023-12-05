const express = require("express");
const router = express.Router();
const {
  getAllServicesController,
  createNewServiceController,
  getServicesOfCoachesController,
  removeServiceOutOfCoachController,
  addServiceForCoachController,
  deleteServiceByIdController,
} = require("../Controllers/service.controller");

const { verifyJWT } = require("../Middlewares/JWT.middleware");
const { isAdmin } = require("../Middlewares/verifyRoles.middleware");

router.use(verifyJWT);
router.get("/coaches/:coachId", getServicesOfCoachesController);
router.use(isAdmin);
router.get("/", getAllServicesController);
router.post("/", createNewServiceController);
router.delete("/coaches", removeServiceOutOfCoachController);
router.post("/coaches", addServiceForCoachController);
router.delete("/:serviceId", deleteServiceByIdController);

module.exports = router;
