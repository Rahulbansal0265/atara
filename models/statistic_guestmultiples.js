/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('statistic_guestmultiples', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'id'
    },

    statistic_id: {
      type: DataTypes.INTEGER(11),
      field: 'statistic_id',
      allowNull: false
    },
    no_guest: {
      type: DataTypes.STRING(11),
      field: 'no_guest',
      allowNull: false
    },
    title: {
      type: DataTypes.STRING(11),
      field: 'title',
      allowNull: false
    },

    
    
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      field: 'createdAt'
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      field: 'updatedAt'
    }
  }, {
    tableName: 'statistic_guestmultiples'
  });
};
