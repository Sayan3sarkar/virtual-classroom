const _isEmpty = require("lodash/isEmpty");
const jwt = require("jsonwebtoken");
const { v4 } = require("uuid");

const {
  MISSING_USER_TOKEN,
  INVALID_CREDENTIALS,
  UNAUTHENTICATED,
  USER_ALREADY_EXISTS,
  USER_NOT_FOUND,
} = require("../config/error-code");
const { formatErrorMessage } = require("../utils/utils");
const { hasher } = require("../utils/hasher");
const { config } = require("../config/config");
const {
  getUserDetailsByEmail,
  getUserDetails,
  getUserSession,
  createUserSession,
  deleteSession,
  saveUser,
  getUserSessionByUserId,
  updateUserSession,
} = require("../database/mysql/repository/user");

class AuthService {
  validateInput(email, password) {
    if (_isEmpty(email) || _isEmpty(password)) {
      throw formatErrorMessage(INVALID_CREDENTIALS); // From security perspective this is quite important
      // That error messages are generic. We should not reveal user does not exist in system/exists but incorrect password
      // API becomes susceptible to attacks like DDOS or burstable requests
    }
  }

  async signUp(email, password, isStudent) {
    const details = await this.fetchUserDetailsByEmail(email);
    if (!_isEmpty(details)) {
      throw formatErrorMessage(USER_ALREADY_EXISTS);
    }

    const hashedPassword = await this.hashPassword(password);
    await saveUser(email, hashedPassword, isStudent); // TODO: add DB method to add to users table
  }

  async login(email, password) {
    const userDetails = await this.fetchUserDetails(email, password);

    const session = await this.fetchUserSessionByUserId(userDetails.userId);

    if (_isEmpty(session)) {
      return await this.createSession(userDetails);
    } else {
      userDetails.sessionId = session.sessionId;
      return await this.updateSession(userDetails);
    }
  }

  async fetchUserDetailsByEmail(email) {
    return await getUserDetailsByEmail(email);
  }

  async fetchUserDetails(email, password) {
    const hashedPassword = await this.hashPassword(password);

    const userDetails = await getUserDetails(email, hashedPassword); // TODO: create DB method

    if (_isEmpty(userDetails)) {
      throw formatErrorMessage(INVALID_CREDENTIALS);
    }

    return userDetails;
  }

  async hashPassword(password) {
    const options = { salt: config.auth.salt, password };
    const { hash } = await hasher(options);

    return hash;
  }

  async createSession(userDetails) {
    const sessionDetails = {
      email: userDetails.email,
      sessionId: v4(),
      isStudent: userDetails.isStudent,
    };

    await createUserSession(sessionDetails.sessionId, userDetails.userId);
    const token = jwt.sign(sessionDetails, config.auth.jwtSecret);
    return token;
  }

  async updateSession(userDetails) {
    const updatedSessionId = v4();
    const sessionDetails = {
      email: userDetails.email,
      sessionId: updatedSessionId,
      isStudent: userDetails.isStudent,
    };

    await updateUserSession(userDetails.sessionId, updatedSessionId);
    const token = jwt.sign(sessionDetails, config.auth.jwtSecret);
    return token;
  }

  validateToken(token) {
    if (_isEmpty(token)) {
      throw formatErrorMessage(MISSING_USER_TOKEN);
    }
    const decodedToken = jwt.decode(token, config.auth.jwtSecret);
    if (_isEmpty(decodedToken)) {
      throw formatErrorMessage(UNAUTHENTICATED);
    }

    return decodedToken;
  }

  async fetchUserSession(sessionId) {
    const userSession = await getUserSession(sessionId);
    if (_isEmpty(userSession)) {
      throw formatErrorMessage(UNAUTHENTICATED);
    }
    return userSession;
  }

  async fetchUserSessionByUserId(userId) {
    const userSession = await getUserSessionByUserId(userId);
    return userSession;
  }

  async removeSession(sessionId) {
    await deleteSession(sessionId);
  }
}

module.exports = {
  AuthService,
};
