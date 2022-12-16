const { login, logout, signup } = require("../controllers/auth-controller");

module.exports = (app, auth) => {
  app.post("/user/signup", signup);
  app.post("/user/login", login);
  app.post("/user/logout", auth, logout);
};
