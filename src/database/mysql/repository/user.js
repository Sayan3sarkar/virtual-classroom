const _get = require("lodash/get");
const { User, UserSession } = require("./index");

const saveUser = async (email, password, isStudent) => {
  await User.create({
    email,
    password,
    isStudent,
  });
};

const getUserDetailsByEmail = async (email) => {
  const result = await User.findOne({
    attributes: [["id", "userId"], "email", "isStudent"],
    where: {
      email,
    },
  });

  const user = _get(result, ["dataValues"], null);
  return user;
};

const getUserDetails = async (email, hashedPassword) => {
  const result = await User.findOne({
    attributes: [["id", "userId"], "email", "isStudent"],
    where: {
      email,
      password: hashedPassword,
    },
  });

  const user = _get(result, ["dataValues"], null);
  return user;
};

const getUserSession = async (sessionId) => {
  const result = await UserSession.findOne({
    attributes: ["sessionId", "userId"],
    where: {
      sessionId,
    },
  });

  const userSession = _get(result, ["dataValues"], null);
  return userSession;
};

const getUserSessionByUserId = async (userId) => {
  const result = await UserSession.findOne({
    attributes: ["sessionId", "userId"],
    where: {
      userId,
    },
  });

  const userSession = _get(result, ["dataValues"], null);
  return userSession;
};

const createUserSession = async (sessionId, userId) => {
  await UserSession.create({
    sessionId,
    userId,
  });
};

const updateUserSession = async (existingSessionId, updatedSessionId) => {
  await UserSession.update(
    {
      sessionId: updatedSessionId,
    },
    {
      where: {
        sessionId: existingSessionId,
      },
    }
  );
};

const deleteSession = async (sessionId) => {
  await UserSession.destroy({
    where: { sessionId },
  });
};

module.exports = {
  saveUser,
  getUserDetailsByEmail,
  getUserDetails,
  getUserSession,
  createUserSession,
  deleteSession,
  updateUserSession,
  getUserSessionByUserId,
};
