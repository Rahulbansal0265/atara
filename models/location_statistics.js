const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "location_statistics",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      influencer_statistic_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      country_one: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      country_two: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      country_three: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      country_one_percentage: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      country_two_percentage: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      country_three_percentage: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      city_one_percentage: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      city_two_percentage: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      city_three_percentage: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      city_one: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      city_two: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      city_three: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "location_statistics",
      timestamps: true,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "id" }],
        },
      ],
    }
  );
};
