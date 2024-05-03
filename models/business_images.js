/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('business_images', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'id'
    },

    business_id: {
      type: DataTypes.INTEGER(11),
      field: 'business_id',
      allowNull: false
    },

    image: {
      type: DataTypes.STRING,
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
    tableName: 'business_images'
  });
};
