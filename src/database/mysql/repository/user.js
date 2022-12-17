const _get = require("lodash/get");
const _isEmpty = require("lodash/isEmpty");
const { Users, UserSession } = require("./index");
const { Op } = require("sequelize");

const saveUser = async (email, password, isStudent) => {
  await Users.create({
    email,
    password,
    isStudent,
  });
};

const getUserDetailsByEmail = async (email) => {
  const result = await Users.findOne({
    attributes: [["id", "userId"], "email", "isStudent"],
    where: {
      email,
    },
  });

  const user = _get(result, ["dataValues"], null);
  return user;
};

const getUserDetails = async (email, hashedPassword) => {
  const result = await Users.findOne({
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
    include: [
      {
        attributes: ["isStudent"],
        model: Users,
        required: true,
      },
    ],
    where: {
      sessionId,
    },
  });

  let userSession = null;

  if (!_isEmpty(result)) {
    userSession = {
      ..._get(result, ["dataValues"], null),
      ..._get(result, ["dataValues", "user", "dataValues"], null),
    };

    if (userSession.user) {
      delete userSession.user;
    }
  }

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

const getStudentListByIds = async (studentIds) => {
  const result = await Users.findAll({
    where: {
      id: {
        [Op.in]: studentIds,
      },
      isStudent: true,
    },
  });

  let studentList = [];
  if (!_isEmpty(result)) {
    studentList = result.map((student) => ({
      ..._get(student, ["dataValues"], {}),
    }));
  }

  return studentList;
};

const getStudentList = async () => {
  const result = await Users.findAll({
    where: {
      isStudent: true,
    },
  });

  const studentList = _get(result, ["dataValues"], []);
  return studentList;
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
  getStudentListByIds,
  getStudentList,
};
