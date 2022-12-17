const { join } = require("path");

const envPath = join(__dirname, "../..", ".env");
require("dotenv").config({
  path: envPath,
});

const env = process.env;

const config = {
  port: env.PORT || 80,
  mysql: {
    host: env.DB_HOST,
    user: env.DB_USERNAME,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    timezone: env.DB_TIMEZONE,
    multipleStatements: true,
    enableSqlLogs: +env.ENABLE_SQL_LOGS || 0,
  },
  auth: {
    jwtSecret: env.JWT_SECRET,
    salt: env.SALT,
  },
  cryptoDigest: env.CRYPTO_DIGEST,
};

module.exports = { config };
