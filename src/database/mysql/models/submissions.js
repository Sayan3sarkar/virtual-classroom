module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "submissions",
    {
      id: {
        type: DataTypes.INTEGER(15),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      assignmentId: {
        type: DataTypes.INTEGER(15),
        allowNull: false,
      },
      studentId: {
        type: DataTypes.INTEGER(15),
        allowNull: false,
      },
      remark: {
        type: DataTypes.STRING(1000),
        allowNull: true,
        defaultValue: null,
      },
      submissionDate: {
        type: "DATETIME",
        defaultValue: DataTypes.NOW,
      },
      status: {
        type: DataTypes.ENUM("PENDING", "SUBMITTED"),
        allowNull: true,
        defaultValue: "PENDING",
      },
      updatedAt: {
        type: "DATETIME",
        defaultValue: DataTypes.NOW,
      },
    },
    { sequelize, tableName: "submissions" }
  );
};
