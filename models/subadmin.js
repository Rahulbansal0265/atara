const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('subadmins', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: true,
      primaryKey: true
    },
    
    name: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: ""
    },
    
   
    image: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue:""
    },

  
    email: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    
    phone: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: ""
    },

    permission: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: 0
    },
    
    status: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue:1
    },

    
    password: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: ""
    },
    
    
  }, {
    sequelize,
    tableName: 'subadmins',
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
