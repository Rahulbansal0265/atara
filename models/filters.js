const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('filters', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
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
    price: {
      type: DataTypes.STRING(255),
      allowNull: true
    }, 
     price2: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    size: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    color: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    colorname: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    display: {
      type: DataTypes.STRING(255),
      allowNull: false
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
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue:1
    },
  }, {
    sequelize,
    tableName: 'filters',
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
