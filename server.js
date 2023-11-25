require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();

const { configMiddleware } = require("./src/Configs/viewMiddleware.config");
const { initWebRoutes } = require("./src/Routes/initWeb.route");
const apiWebRoutes = require("./src/Routes/api.route");
const { connectDB } = require("./src/Configs/connectDB.config");
const { connectRedis } = require("./src/Configs/connectRedis.config");

const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Initialize API Routes
apiWebRoutes(app);

// Connect database
connectDB();

// Connect Redis
connectRedis();

app.listen(port, () => {
  console.log("Server listening on port " + port);
});
