const _ = require("lodash");

const { AuthService } = require("../services/AuthService");

const auth = async (req, res, next) => {
  try {
    const token = _.get(req, ["headers", "token"], null); // Extracting jwt from custom header "token", convention is to send by "Authorization" Header
    const authService = new AuthService();

    const decodedToken = authService.validateToken(token);

    const sessionDetails = await authService.fetchUserSession(
      decodedToken.sessionId
    );

    /**
     * sample sessionDetails structure is as follows:
     * {
     *    "userId": 1234,
     *    "sessionId": "sadh413i1u313u",
     *    "isStudent": true
     * }
     */

    req.user = sessionDetails;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { auth };
