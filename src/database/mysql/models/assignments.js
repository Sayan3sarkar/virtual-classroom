module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "assignments",
    {
      id: {
        type: DataTypes.INTEGER(15),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      description: {
        type: DataTypes.STRING(200),
        allowNull: true,
        defaultValue: null,
      },
      tutorId: {
        type: DataTypes.INTEGER(15),
        allowNull: false,
      },
      publishedAt: {
        type: "DATETIME",
        defaultValue: DataTypes.NOW,
        allowNull: false,
      },
      deadline: {
        type: "DATETIME",
        defaultValue: DataTypes.NOW,
        allowNull: false,
      },
    },
    { sequelize, tableName: "assignments" }
  );
};
