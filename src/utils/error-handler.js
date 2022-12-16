const { formatErrorMessage } = require("./utils");

const errorHandler = (err, req, res, next) => {
  if (err) {
    const errorObj = formatErrorMessage(err);

    return res.status(errorObj.statusCode).send({
      message: errorObj.message,
      statusCode: errorObj.statusCode,
      errorCode: errorObj.errorCode,
    });
  } else {
    next();
  }
};

module.exports = {
  errorHandler,
};
