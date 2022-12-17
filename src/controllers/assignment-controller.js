const moment = require("moment");
const _uniq = require("lodash/uniq");
const _isEmpty = require("lodash/isEmpty");

const { AssignmentService } = require("../services/AssignmentService");
const { EOD } = require("../config/constants");
const { customErrorMessageUtil } = require("../utils/utils");
const { UNAUTHORIZED } = require("../config/error-code");

// PENDING
const assignmentFeed = async (req, res, next) => {
  const { userId, isStudent } = req.user;
  try {
    const assignmentService = new AssignmentService(userId, isStudent);
    const assignments = await assignmentService.fetchAssignments();
    res.send(assignments);
  } catch (err) {
    console.log(
      `Error while fetching assignment feed for user ${userId} ||| ${err}`
    );
    next(err);
  }
};

const assignmentDetails = async (req, res, next) => {
  const { id: assignmentId } = req.params;
  const { userId, isStudent } = req.user;
  try {
    const assignmentService = new AssignmentService(userId, isStudent);
    const assignment = await assignmentService.fetchAssignment(assignmentId);
    res.send(assignment);
  } catch (err) {
    console.log(
      `Error while fetching assignment details for user ${userId} ||| ${err}`
    );
    next(err);
  }
};

/****** Tutor Controllers ******/
const createAssignment = async (req, res, next) => {
  const { userId, isStudent } = req.user;

  try {
    let { description = "", publishDate, deadlineDate, studentList } = req.body;
    const currentTime = moment().format("HH:mm:ss");

    if (isStudent) {
      throw customErrorMessageUtil(
        UNAUTHORIZED,
        ". Only tutor an create Assignment"
      );
    }

    publishDate += ` ${currentTime}`;
    deadlineDate += ` ${EOD}`;
    studentList = _uniq(studentList); //  remove duplicates

    const assignmentService = new AssignmentService(userId, isStudent);
    await assignmentService.validateStudentList(studentList);

    await assignmentService.createAssignment({
      description,
      publishDate,
      deadlineDate,
      studentList,
    });
    res.send();
  } catch (err) {
    console.log(`Error while creating assignment by user ${userId} ||| ${err}`);
    next(err);
  }
};

const updateAssignment = async (req, res, next) => {
  const { id: assignmentId } = req.params;
  const body = { ...req.body };
  let { description, deadlineDate = null } = body; // deliberately kept in 2 steps instead of direct destructuring so as to not compromise actual request body
  const { userId, isStudent } = req.user;

  try {
    if (_isEmpty(description)) {
      delete body.description;
    }
    if (!_isEmpty(deadlineDate)) {
      deadlineDate += ` ${EOD}`;
      body.deadlineDate = deadlineDate;
    }
    const assignmentService = new AssignmentService(userId, isStudent);
    await assignmentService.validateUpdateAssignment(assignmentId);
    await assignmentService.updateAssignment(assignmentId, body);
    res.send(
      `Successfully Updated Assignment ${assignmentId} by user ${userId}`
    );
  } catch (err) {
    console.log(
      `Error while updating assignment for user ${userId} ||| ${err}`
    );
    next(err);
  }
};

const deleteAssignment = async (req, res, next) => {
  const { id: assignmentId } = req.params;
  const { userId, isStudent } = req.user;
  try {
    const assignmentService = new AssignmentService(userId, isStudent);
    await assignmentService.validateDeleteAssignment(assignmentId);
    await assignmentService.deleteAssignment(assignmentId);
    res.send(`Succesfully deleted assignment ${assignmentId}`);
  } catch (err) {
    console.log(
      `Error while deleting assignment for user ${userId} ||| ${err}`
    );
    next(err);
  }
};

/****** Student Controllers ******/
// PENDING
const submitAssignment = async (req, res, next) => {
  console.log("Inside Submit Assignment");
  res.send();
};

module.exports = {
  assignmentFeed,
  assignmentDetails,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  submitAssignment,
};
