const _get = require("lodash/get");

const formatErrorMessage = (errorKey) => {
  const error = new Error(_get(errorKey, ["message"], "Something went wrong"));
  error.statusCode = _get(errorKey, ["statusCode"], 500);
  error.errorCode = _get(errorKey, ["errorCode"], "INTERNAL_SERVER_ERROR");
  return error;
};

module.exports = {
  formatErrorMessage,
};
