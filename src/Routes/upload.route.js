const express = require("express");
const multer = require("multer");
const router = express.Router();

// const uploadMiddleware = require("../Middlewares/uploadFirebase.middleware");
const { uploadImageController } = require("../Controllers/upload.controller");
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("image"), uploadImageController);

module.exports = router;
