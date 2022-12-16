module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "userSession",
    {
      id: {
        type: DataTypes.INTEGER(15),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      sessionId: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      userId: {
        type: DataTypes.INTEGER(15),
        allowNull: false,
        defaultValue: 0,
      },
      created_at: {
        type: "DATETIME",
        defaultValue: DataTypes.NOW,
      },
    },
    { sequelize, tableName: "userSession" }
  );
};
