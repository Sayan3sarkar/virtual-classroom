const _ = require("lodash");

const { AuthService } = require("../services/AuthService");

const auth = async (req, res, next) => {
  try {
    const token = _.get(req, ["headers", "token"], null);
    const authService = new AuthService();

    const decodedToken = authService.validateToken(token);

    const sessionDetails = await authService.fetchUserSession(decodedToken.sessionId);

    /**
     * sample sessionDetails structure is as follows:
     * {
     *    email: "test@test.com",
     *    sessionId: "sadh413i1u313u"
     * }
     */

    req.user = sessionDetails;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { auth };
