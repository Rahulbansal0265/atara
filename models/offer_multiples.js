/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('offer_multiples', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'id'
    },

    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
   offer_id: {
        type: DataTypes.INTEGER(11),
        allowNull: false
      },

    offer_condition: {
      type: DataTypes.STRING,
      allowNull: false
    },

    offer: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: " ",
    },

    brief: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: " ",
    },
    status: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '1',
      field: 'status'
    },
    
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      field: 'created_at'
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      field: 'updated_at'
    }
  }, {
    tableName: 'offer_multiples'
  });
};
