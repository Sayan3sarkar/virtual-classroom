const _isEmpty = require("lodash/isEmpty");
const _get = require("lodash/get");
const moment = require("moment");
const { Assignments, Submissions, sequelizeConn } = require("./index");
const { Op } = require("sequelize");
const { EOD } = require("../../../config/constants");

const createNewAssignment = async (assingmentDetails) =>
  await Assignments.create(assingmentDetails);

const createNewSubmission = async (submissionDetails) => {
  await Submissions.create(submissionDetails);
};

const getAssignmentDetailsForTutor = async (assignmentId, tutorId) => {
  const result = await Assignments.findOne({
    attributes: [
      ["id", "assignmentId"],
      "description",
      "publishedAt",
      "deadline",
    ],
    include: {
      model: Submissions,
      attributes: [["id", "submissionId"], "studentId", "remark", "status"],
      required: true,
    },
    where: {
      tutorId,
      id: assignmentId,
    },
  });

  let assignmentDetails = null;

  if (!_isEmpty(result)) {
    assignmentDetails = {
      ..._get(result, ["dataValues"], {}),
      ..._get(result, ["dataValues", "submissions", "dataValues"], {}),
    };
  }

  return assignmentDetails;
};

const getAssignmentDetailsForStudent = async (assignmentId, studentId) => {
  const result = await Submissions.findOne({
    attributes: [
      ["id", "submissionId"],
      "assignmentId",
      "remark",
      "submissionDate",
      "status",
    ],
    include: {
      model: Assignments,
      attributes: ["description", "deadline", "publishedAt", "tutorId"],
      required: true,
    },
    where: {
      studentId,
      assignmentId: assignmentId,
    },
  });
  let assignmentDetails = null;

  if (!_isEmpty(result)) {
    assignmentDetails = {
      ..._get(result, ["dataValues"], {}),
      ..._get(result, ["dataValues", "assignment", "dataValues"], {}),
    };

    if (assignmentDetails.assignment) {
      delete assignmentDetails.assignment;
    }
  }

  return assignmentDetails;
};

const getAssignmentById = async (assignmentId) => {
  const result = await Assignments.findOne({
    attributes: ["tutorId", "deadline"],
    where: {
      id: assignmentId,
    },
  });

  const assignment = _get(result, ["dataValues"], null);
  return assignment;
};

const updateAssignmentById = async (assignmentId, updatedAssignmentDetails) => {
  await Assignments.update(
    {
      ...updatedAssignmentDetails,
    },
    {
      where: {
        id: assignmentId,
      },
    }
  );
};

const deleteAssignmentById = async (assignmentId) => {
  // Managed Transaction i.e. Commit and Rollback are handled by sequelize
  await sequelizeConn.transaction(async (t) => {
    await Assignments.destroy(
      {
        where: {
          id: assignmentId,
        },
      },
      { transaction: t }
    );

    await Submissions.destroy(
      {
        where: {
          assignmentId,
        },
      },
      { transaction: t }
    );

    console.log("Transaction Successful");
  });
};

const updateSubmission = async (assignmentId, remark, studentId) => {
  await Submissions.update(
    {
      remark,
      status: "SUBMITTED",
    },
    {
      where: {
        assignmentId,
        studentId,
      },
    }
  );
};

const formatFilterForTutor = ({ publishedAt, status = "ALL" }) => {
  let currentDate = moment().format("YYYY-MM-DD");
  const whereCondition = {};
  if (!_isEmpty(publishedAt)) {
    if (publishedAt === "SCHEDULED") {
      whereCondition.publishedAt = {
        [Op.gt]: (currentDate += " 00:00:00"),
      };
    } else if (publishedAt === "ONGOING") {
      whereCondition.publishedAt = {
        [Op.lte]: (currentDate += ` ${EOD}`),
      };
    }
  }

  // Status Filter
  const acceptableFilters = ["ALL", "PENDING", "SUBMITTED"];
  if (acceptableFilters.includes(status)) {
    if (status !== "ALL") {
      whereCondition = {
        ...whereCondition,
        "$submissions.status": status,
      };
    }
  }

  return whereCondition;
};

const assignmentFeedForTutor = async (filter, tutorId) => {
  const whereCondition = formatFilterForTutor(filter);
  const result = await Assignments.findAll({
    attributes: [
      ["id", "assignmentId"],
      "description",
      "publishedAt",
      "deadline",
    ],
    include: {
      model: Submissions,
      attributes: [["id", "submissionId"], "studentId", "remark", "status"],
      required: true,
    },
    where: {
      tutorId,
      ...whereCondition,
    },
  });

  let assignments = [];

  if (!_isEmpty(result)) {
    assignments = result.map((item) => ({
      ..._get(item, ["dataValues"], {}),
      ..._get(item, ["dataValues", "submissions", "dataValues"], {}),
    }));
  }

  return assignments;
};

const formatFilterForStudent = ({ publishedAt, status = "ALL" }) => {
  let currentDate = moment().format("YYYY-MM-DD");
  const whereCondition = {};

  // Status Filter
  const acceptableFilters = ["ALL", "PENDING", "SUBMITTED"];
  if (acceptableFilters.includes(status)) {
    if (status !== "ALL") {
      whereCondition.status = status;
    }
  }

  if (!_isEmpty(publishedAt)) {
    if (filter.publishedAt === "SCHEDULED") {
      whereCondition = {
        ...whereCondition,
        "$assignments.publishedAt": {
          [Op.gt]: (currentDate += " 00:00:00"),
        },
      };
    } else if (filter.publishedAt === "ONGOING") {
      whereCondition = {
        ...whereCondition,
        "$assignments.publishedAt": {
          [Op.lte]: (currentDate += ` ${EOD}`),
        },
      };
    }
  }

  return whereCondition;
};

const assignmentFeedForStudent = async (filter, studentId) => {
  const whereCondition = formatFilterForStudent(filter);
  const result = await Submissions.findAll({
    attributes: [
      ["id", "submissionId"],
      "assignmentId",
      "remark",
      "submissionDate",
      "status",
    ],
    include: {
      model: Assignments,
      attributes: ["description", "deadline", "publishedAt", "tutorId"],
      required: true,
    },
    where: {
      studentId,
      ...whereCondition,
    },
  });

  let assignments = [];

  if (!_isEmpty(result)) {
    assignments = result.map((item) => ({
      ..._get(item, ["dataValues"], {}),
      ..._get(item, ["dataValues", "submissions", "dataValues"], {}),
    }));
  }

  return assignments;
};

module.exports = {
  createNewAssignment,
  createNewSubmission,
  getAssignmentDetailsForTutor,
  getAssignmentDetailsForStudent,
  getAssignmentById,
  updateAssignmentById,
  deleteAssignmentById,
  updateSubmission,
  assignmentFeedForTutor,
  assignmentFeedForStudent,
};
