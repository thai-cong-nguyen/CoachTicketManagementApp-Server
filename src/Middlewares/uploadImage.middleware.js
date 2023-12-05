require("dotenv").config();
const upload = multer({ storage: multer.memoryStorage() });

const uploadImageMiddleware = async (req, res, next) => {
  try {
    upload.single("image")(req, res, (err) => {
      if (err) {
        console.error("Multer error:", err);
        return res.status(400).send("Multer error: " + err.message);
      }
      next();
    });
  } catch (error) {
    console.error("Route error:", error);
    return res.status(500).send("Something went wrong");
  }
};

module.exports = { uploadImageMiddleware };
