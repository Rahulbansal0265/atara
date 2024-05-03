const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('contactUs', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: ""
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: ""
      },
      message: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: ""
      },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
   
  }, {
    sequelize,
    tableName: 'contactUs',
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
