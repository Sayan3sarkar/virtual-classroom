const express = require("express");
const cors = require("cors");

const { auth } = require("./middleware/auth");
const authRoutes = require("./routes/auth-routes");
const { errorHandler } = require("./utils/error-handler");

const app = express();
app.use(cors());
app.use(express.json());

authRoutes(app, auth);
app.use(errorHandler);

module.exports = {
  app,
};
