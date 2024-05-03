const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('our_selection_of_week', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    offer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue:0,
    },
    is_all: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue:0,
    },
    }, {
    sequelize,
    tableName: 'our_selection_of_week',
    timestamps: false,
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
