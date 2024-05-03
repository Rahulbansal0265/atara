const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('requests', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    subcategoryId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    brand: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    min_price: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    max_price: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    size: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    color: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    color_code: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue:""
    },
    display: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    brand_comment: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    price_comment: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    size_comment: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    color_comment: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    display_comment: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    materialtype: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    is_respond: {
   
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue:0
   
    },
  }, {
    sequelize,
    tableName: 'requests',
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
