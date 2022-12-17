const _isEmpty = require("lodash/isEmpty");
const _isBoolean = require("lodash/isBoolean");
const moment = require("moment");

const {
  formatErrorMessage,
  customErrorMessageUtil,
} = require("../utils/utils");
const {
  UNAUTHORIZED,
  EMPTY_ASSIGNMENT_ID,
  INVALID_ASSIGNMENT_ID,
} = require("../config/error-code");
const {
  createNewAssignment,
  createNewSubmission,
  getAssignmentDetailsForTutor,
  getAssignmentDetailsForStudent,
  getAssignmentById,
  updateAssignmentById,
  deleteAssignmentById,
} = require("../database/mysql/repository/assignments");
const { AuthService } = require("./AuthService");

class AssignmentService extends AuthService {
  constructor(userId, isStudent) {
    if (!userId || !_isBoolean(isStudent)) {
      throw formatErrorMessage({
        message: "Initiated with empty userId or isStudent status",
      });
    }
    super();
    this.userId = userId;
    this.isStudent = isStudent;
  }

  async fetchAssignments() {
    const assignments = []; //TODO: create DB method to fetch assignments
    return assignments;
  }

  async fetchAssignment(assignmentId) {
    const assignmentDetails = this.isStudent
      ? await getAssignmentDetailsForStudent(assignmentId, this.userId)
      : await getAssignmentDetailsForTutor(assignmentId, this.userId);
    return assignmentDetails;
  }

  async createAssignment({
    description,
    publishDate,
    deadlineDate,
    studentList,
  }) {
    if (this.isStudent) {
      throw formatErrorMessage(UNAUTHORIZED);
    } else {
      const assignmentObj = {
        description,
        tutorId: this.userId,
        publishedAt: publishDate,
        deadline: deadlineDate,
      };
      const result = await createNewAssignment(assignmentObj);
      const assignmentId = result.dataValues.id;

      for (let i = 0; i < studentList.length; i++) {
        const submissionObj = {
          assignmentId,
          studentId: studentList[i],
        };

        await createNewSubmission(submissionObj);
      }
    }
  }

  async fetchAssignmentById(assignmentId) {
    const assignment = await getAssignmentById(assignmentId);
    if (_isEmpty(assignment)) {
      throw formatErrorMessage(INVALID_ASSIGNMENT_ID);
    }
    return assignment;
  }

  async validateUpdateAssignment(assignmentId) {
    if (this.isStudent) {
      throw customErrorMessageUtil(
        UNAUTHORIZED,
        ". Only tutor can update assignments"
      );
    }

    if (_isEmpty(assignmentId)) {
      throw formatErrorMessage(EMPTY_ASSIGNMENT_ID);
    }

    const assignment = await this.fetchAssignmentById(assignmentId);

    if (this.userId !== assignment.tutorId) {
      throw customErrorMessageUtil(
        UNAUTHORIZED,
        ", Not Authorized to update this assignment"
      );
    }
  }

  async updateAssignment(assignmentId, updatedDetails) {
    const assignment = this.fetchAssignment(assignmentId);
    const existingDeadline = moment(
      assignment.deadline,
      "YYYY-MM-DD HH:mm:ss"
    ).format("YYYY-MM-DD HH:mm:ss");

    // Ignore new deadline if null or same as  existing
    if (
      _isEmpty(updatedDetails.deadlineDate) ||
      (!_isEmpty(updatedDetails.deadlineDate) &&
        updatedDetails.deadlineDate === existingDeadline)
    ) {
      delete updatedDetails.deadlineDate;
    } else {
      updatedDetails.deadline = updatedDetails.deadlineDate;
      delete updatedDetails.deadlineDate;
    }

    if (!_isEmpty(updatedDetails)) {
      await updateAssignmentById(assignmentId, updatedDetails);
    }
  }

  async validateDeleteAssignment(assignmentId) {
    if (this.isStudent) {
      throw customErrorMessageUtil(
        UNAUTHORIZED,
        ". Only tutor can delete assignments"
      );
    }

    if (_isEmpty(assignmentId)) {
      throw formatErrorMessage(EMPTY_ASSIGNMENT_ID);
    }

    const assignment = await this.fetchAssignmentById(assignmentId);

    if (this.userId !== assignment.tutorId) {
      throw customErrorMessageUtil(
        UNAUTHORIZED,
        ", Not Authorized to update this assignment"
      );
    }
  }

  async deleteAssignment(assingmentId) {
    await deleteAssignmentById(assingmentId);
  }
}

module.exports = {
  AssignmentService,
};
