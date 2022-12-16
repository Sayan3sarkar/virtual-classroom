const crypto = require("crypto");
const _isEmpty = require("lodash/isEmpty");
const { config } = require("../config/config");

const hasher = (options) => {
  let salt;
  if (_isEmpty(options.salt)) {
    salt = crypto.randomBytes(128).toString("base64");
  } else {
    salt = options.salt;
  }

  return new Promise((resolve, reject) => {
    crypto.pbkdf2(
      options.password,
      salt,
      10000,
      32,
      config.cryptoDigest,
      (err, derivedKey) => {
        if (err) {
          return reject(err);
        }
        const hash = Buffer.from(derivedKey).toString("hex");
        resolve({
          salt,
          hash,
        });
      }
    );
  });
};

module.exports = { hasher };
