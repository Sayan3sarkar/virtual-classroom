const { Sequelize, DataTypes } = require("sequelize");

const { config } = require("../../../config/config");

const sequelizeConn = new Sequelize(
  config.mysql.database,
  config.mysql.user,
  config.mysql.password,
  {
    host: config.mysql.host,
    dialect: "mysql",
    logging: (ele) => {
      if (process.env.enableSqlLogs) {
        console.log(ele);
      }
    },
    define: {
      timestamps: false,
    },
    pool: {
      max: 30,
      min: 1,
      idle: 10000,
    },
  }
);

const closeConnection = async () => {
  await sequelizeConn.close();
};

const User = require("../models/users")(sequelizeConn, DataTypes);
const UserSession = require("../models/userSession")(sequelizeConn, DataTypes);

User.hasOne(UserSession, {
  sourceKey: "id",
  foreignKey: "userId",
});

UserSession.hasOne(User, {
  sourceKey: "userId",
  foreignKey: "id",
});

module.exports = {
  sequelizeConn,
  User,
  UserSession,
  closeConnection,
};
