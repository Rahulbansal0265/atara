/* jshint indent: 1 */

module.exports = function (sequelize, DataTypes) {
  var offers = sequelize.define(
    "offers",
    {
      id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "id",
      },
      brief: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: " ",
      },
      image: {
        type: DataTypes.STRING,
        field: "image",
        allowNull: true,
        defaultValue:''
      },
      title: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      business_id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
      },

      location: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue:''
      },

      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      time: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue:''
      },

      social_media_link: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue:''
      },

      offer_condition: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue:''
      },

      offer: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: " ",
      },

      status: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        defaultValue: "1",
        field: "status",
      },
      deleted_at: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 0,
        Comment:"0=not_delete  1=deleted"
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
      tableName: "offers",
    }
  );
  offers.associate = function (models) {
    offers.hasMany(models.offer_multiples, {
      foreignKey: "offer_id",
    });
  };
  return offers;
};
