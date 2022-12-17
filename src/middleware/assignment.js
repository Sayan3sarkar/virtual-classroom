const { INVALID_REQUEST_SCHEMA } = require("../config/error-code");
const {
  createAssignmentSchema,
} = require("../request-schema/assignment-schema");
const { customErrorMessageUtil } = require("../utils/utils");

const validateAssignmentCreation = (req, res, next) => {
  try {
    const { value, error } = createAssignmentSchema.validate(req.body);

    if (error) {
      throw customErrorMessageUtil(INVALID_REQUEST_SCHEMA, error.message);
    }

    req.body = value;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  validateAssignmentCreation,
};
