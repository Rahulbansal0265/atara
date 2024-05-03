/* jshint indent: 1 */
const models = require("../models");

module.exports = function (sequelize, DataTypes) {
  const statistics = sequelize.define(
    "statistics",
    {
      id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "id",
      },

      pro_id: {
        type: DataTypes.INTEGER(11),
        field: "pro_id",
        allowNull: true,
      },
      business_id: {
        type: DataTypes.INTEGER(11),
        field: "business_id",
        allowNull: true,
      },

      no_stories: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
      },

      no_views: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
      },
      no_guest: {
        type: DataTypes.INTEGER(11),
        allowNull: true,
      },
      money: {
        type: DataTypes.STRING(11),
        allowNull: false,
      },
      partnership: {
        type: DataTypes.INTEGER(11),
        allowNull: true,
      },
      influencer: {
        type: DataTypes.INTEGER(11),
        allowNull: true,
      },
      statistics_of_the_month: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue:""
      },
      campaign_performed: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue:""
      },
      number_of_interactions: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue:""
      },
      best_influencer: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue:""
      },
      status: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        defaultValue: "1",
        field: "status",
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
      sequelize,
      tableName: "statistics",
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
  statistics.associate = function (models) {
    statistics.belongsTo(models.users, {
      foreignKey: "pro_id",
      // as: "pro",
    })
    statistics.belongsTo(models.businesses, {
      foreignKey: "business_id",
      // as: "business",
    });
  };
  return statistics;
};
