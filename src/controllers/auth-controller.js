const _get = require("lodash/get");
const { AuthService } = require("../services/AuthService");

const signup = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const isStudent = _get(req, ["body", "isStudent"], true); // isStudent by default false
    const authService = new AuthService();
    authService.validateInput(email, password);

    const formattedResponseData = await authService.signUp(
      email,
      password,
      isStudent
    );
    res.send(formattedResponseData);
  } catch (err) {
    console.log(`Error while signing user up: ${err}`);
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const authService = new AuthService();
    authService.validateInput(email, password);

    const token = await authService.login(email, password);
    res.send(token);
  } catch (err) {
    console.log(`Error while logging user in: ${err}`);
    next(err);
  }
};

const logout = async (req, res, next) => {
  try {
    console.log("In logout controller");
    const { sessionId } = req.user;
    const authService = new AuthService();

    await authService.removeSession(sessionId);
    res.send("Logged out successfully");
  } catch (err) {
    console.log(`Error while logging user out: ${err}`);
    next(err);
  }
};

module.exports = {
  login,
  logout,
  signup,
};
