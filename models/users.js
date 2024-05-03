const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "users",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: true,
        primaryKey: true,
      },
      type: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      subadmin_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      otp_verified: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      full_name: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: "",
      },
      lastname: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: "",
      },
      age: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      gender: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: "",
      },
      birthdate: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: "",
      },
      login_time: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: "login_time",
        defaultValue: "0",
      },
      bio: {
        type: DataTypes.TEXT(),
        allowNull: true,
        defaultValue: "",
      },
      permission: {
        type: DataTypes.TEXT(),
        allowNull: false,
        defaultValue: "",
      },
      payment: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: "",
      },
      payment_end: {
        type: DataTypes.DATE(100),
        allowNull: true,
        defaultValue: 0,
      },
      image: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: "",
      },

      email: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      country_code: {
        type: DataTypes.STRING(20),
        allowNull: true,
        defaultValue: "",
      },
      phone: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: "",
      },
      website_url: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: "",
      },
      status: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: 1,
      },

      is_approved: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: 1,
      },
      otp: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: "",
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: "",
      },
      resetpassword_token:{
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: "",
      },
      device_type: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      device_token: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: "",
      },
      socialType: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      stripe_id: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: "",
      },
      insta_id: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: "",
      },
      tiktok_id: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: "",
      },

      notificationStatus: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      socialId: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: "",
      },
      token: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: ""
      },
      language_type:{
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      }
    },
    {
      sequelize,
      tableName: "users",
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
