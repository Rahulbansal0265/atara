/* jshint indent: 1 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "business_day_times",
    {
      id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "id",
      },

      business_id: {
        type: DataTypes.INTEGER(11),
        field: "business_id",
        allowNull: true,
      },

      day: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      open_time: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "",
      },

      close_time: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "",
      },
      is_closed: {
        type: DataTypes.INTEGER(11),
        allowNull: true,
        defaultValue: "1",
        field: "is_closed",
      },

      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
        field: "created_at",
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
        field: "updated_at",
      },
    },
    {
      tableName: "business_day_times",
    }
  );
};
