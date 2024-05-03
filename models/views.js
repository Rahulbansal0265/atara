/* jshint indent: 1 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "views",
    {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "id",
      },
      influencer_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      viewer_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
      },
    },
    {
      tableName: "views",
      timestamps: false,
      hooks: {
        beforeCreate: (record, options) => {
          record.dataValues.created = Math.round(new Date().getTime() / 1000);
          record.dataValues.updated = Math.round(new Date().getTime() / 1000);
        },
        beforeUpdate: (record, options) => {
          record.dataValues.updated = Math.round(new Date().getTime() / 1000);
        },
        beforeBulkCreate: (records, options) => {
          if (Array.isArray(records)) {
            records.forEach(function (record) {
              record.dataValues.created = Math.round(
                new Date().getTime() / 1000
              );
              record.dataValues.updated = Math.round(
                new Date().getTime() / 1000
              );
            });
          }
        },
        beforeBulkUpdate: (records, options) => {
          if (Array.isArray(records)) {
            records.forEach(function (record) {
              record.dataValues.updated = Math.round(
                new Date().getTime() / 1000
              );
            });
          }
        },
      },
    }
  );
};
