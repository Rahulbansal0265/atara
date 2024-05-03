const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('orders', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    cart_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },address_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    order_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
     place_date: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: ""
    },
     shipping_date: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: ""
    },
     received_date: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: ""
    },
     delivered_date: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: ""
    }
  }, {
    sequelize,
    tableName: 'orders',
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
