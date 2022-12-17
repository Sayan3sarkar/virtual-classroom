const express = require("express");
const cors = require("cors");

const { auth } = require("./middleware/auth");
const { errorHandler } = require("./utils/error-handler");

const authRoutes = require("./routes/auth-routes");
const assignmentRoutes = require("./routes/assignment-routes");

const app = express();
app.use(cors());
app.use(express.json());

authRoutes(app, auth);
assignmentRoutes(app, auth);

app.use(errorHandler);

module.exports = {
  app,
};
