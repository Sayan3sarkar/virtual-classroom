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
      if (process.env.ENABLE_SQL_LOGS == 1) {
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

const Users = require("../models/users")(sequelizeConn, DataTypes);
const UserSession = require("../models/userSession")(sequelizeConn, DataTypes);
const Assignments = require("../models/assignments")(sequelizeConn, DataTypes);
const Submissions = require("../models/submissions")(sequelizeConn, DataTypes);

Users.hasOne(UserSession, {
  sourceKey: "id",
  foreignKey: "userId",
});

UserSession.belongsTo(Users, {
  targetKey: "id",
  foreignKey: "userId",
});

Assignments.hasMany(Submissions, {
  sourceKey: "id",
  foreignKey: "assignmentId",
});

Submissions.belongsTo(Assignments, {
  targetKey: "id",
  foreignKey: "assignmentId",
});

// Users.belongsToMany(Assignments, {
//   through: Submissions,
// constraints: false,
// foreignKey: "studentId",
// sourceKey: "id",
// });

// Assignments.belongsToMany(Users, {
//   through: Submissions,
// constraints: false,
// foreignKey: "id",
// sourceKey: "studentId",
// });

module.exports = {
  sequelizeConn,
  Users,
  UserSession,
  Assignments,
  Submissions,
  closeConnection,
};
