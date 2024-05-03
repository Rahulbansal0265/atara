/* jshint indent: 1 */

module.exports = function (sequelize, DataTypes) {
  var bussiness = sequelize.define(
    "businesses",
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
      category_id: {
        type: DataTypes.INTEGER(11),
        field: "category_id",
        allowNull: true,
        defaultValue : 0
      },

      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      offer_terms: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue:''
      },

      location: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      latitude: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      longitude: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      open_time: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue:''
      },

      close_time: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue:''
      },

      off_day: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue:''
      },

      social_media_link: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "",
      },
      insta: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "",
      },
      facebook: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "",
      },
      tiktok: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "",
      },
      youtube: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "",
      },

      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      description: {
        type: DataTypes.TEXT,
        allowNull: false,
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
      tableName: "businesses",
    }
  );
  bussiness.associate = function (models) {
    bussiness.hasMany(models.business_images, {
      foreignKey: "business_id",
    });
  };
  
  return bussiness;
};
