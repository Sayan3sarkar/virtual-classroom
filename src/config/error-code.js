const MISSING_USER_TOKEN = {
  statusCode: 401,
  errorCode: "MISSING_USER_TOKEN",
  message: "Token is missing",
};

const INVALID_CREDENTIALS = {
  statusCode: 401,
  errorCode: "INVALID_CREDENTIALS",
  message: "Invalid Users Credentials",
};

const UNAUTHENTICATED = {
  statusCode: 401,
  errorCode: "UNAUTHENTICATED",
  message: "Un-authenticated",
};

const UNAUTHORIZED = {
  statusCode: 401,
  errorCode: "UNAUTHORIZED",
  message: "Un-authorized",
};

const USER_ALREADY_EXISTS = {
  statusCode: 400,
  errorCode: "USER_ALREADY_EXISTS",
  message: "Users already exists",
};

const USER_NOT_FOUND = {
  statusCode: 404,
  errorCode: "USER_NOT_FOUND",
  message: "Users Not Found",
};

const EMPTY_STUDENT_LIST = {
  statusCode: 400,
  errorCode: "EMPTY_STUDENT_LIST",
  message: "studentList can't be empty",
};

const INVALID_STUDENT_LIST = {
  statusCode: 404,
  errorCode: "INVALID_STUDENT_LIST",
  message: "Some/All students in list does not exist",
};

const INVALID_REQUEST_SCHEMA = {
  statusCode: 400,
  errorCode: "INVALID_REQUEST_SCHEMA",
  message: "Invalid Request Schema. ",
};

const EMPTY_ASSIGNMENT_ID = {
  statusCode: 400,
  errorCode: "EMPTY_ASSIGNMENT_ID",
  message: "Assignment Id can't be empty",
};

const INVALID_ASSIGNMENT_ID = {
  statusCode: 404,
  errorCode: "INVALID_ASSIGNMENT_ID",
  message: "Invalid Assignment Id",
};

module.exports = {
  MISSING_USER_TOKEN,
  INVALID_CREDENTIALS,
  UNAUTHENTICATED,
  USER_ALREADY_EXISTS,
  USER_NOT_FOUND,
  EMPTY_STUDENT_LIST,
  INVALID_REQUEST_SCHEMA,
  UNAUTHORIZED,
  INVALID_STUDENT_LIST,
  EMPTY_ASSIGNMENT_ID,
  INVALID_ASSIGNMENT_ID,
};
