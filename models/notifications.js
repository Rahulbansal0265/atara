const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('notifications', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    sender_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue:0,
    },
    reciever_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
     target_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue:0,
    },
    title: {
      type: DataTypes.STRING(150),
      allowNull: false,
      defaultValue:""
    },
    message: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue:"",
    },
    is_read: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    type: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0
    },
    data: {
      type: DataTypes.JSON,
      allowNull: false,
    }
  }, {
    sequelize,
    tableName: 'notifications',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
