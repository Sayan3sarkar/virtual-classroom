const _isEmpty = require("lodash/isEmpty");
const _get = require("lodash/get");
const { Assignments, Submissions, sequelizeConn } = require("./index");

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

module.exports = {
  createNewAssignment,
  createNewSubmission,
  getAssignmentDetailsForTutor,
  getAssignmentDetailsForStudent,
  getAssignmentById,
  updateAssignmentById,
  deleteAssignmentById,
  updateSubmission,
};
