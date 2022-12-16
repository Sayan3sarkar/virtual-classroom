const MISSING_USER_TOKEN = {
  statusCode: 401,
  errorCode: "MISSING_USER_TOKEN",
  message: "Token is missing",
};

const INVALID_CREDENTIALS = {
  statusCode: 401,
  errorCode: "INVALID_CREDENTIALS",
  message: "Invalid User Credentials",
};

const UNAUTHENTICATED = {
  statusCode: 401,
  errorCode: "UNAUTHENTICATED",
  message: "Un-authenticated",
};

const USER_ALREADY_EXISTS = {
  statusCode: 400,
  errorCode: "USER_ALREADY_EXISTS",
  message: "User already exists",
};

const USER_NOT_FOUND = {
  statusCode: 404,
  errorCode: "USER_NOT_FOUND",
  message: "User Not Found",
};

module.exports = {
  MISSING_USER_TOKEN,
  INVALID_CREDENTIALS,
  UNAUTHENTICATED,
  USER_ALREADY_EXISTS,
  USER_NOT_FOUND,
};
