module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "users",
    {
      id: {
        type: DataTypes.INTEGER(15),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      isStudent: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      assignmentIds: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: null,
      },
    },
    { sequelize, tableName: "users" }
  );
};
