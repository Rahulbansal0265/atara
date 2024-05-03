/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('categories', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'id'
    },

    image: {
      type: DataTypes.STRING,
      field: 'image',
      allowNull: true
    },
    category_icon: {
      type: DataTypes.STRING(255),
      field: 'category_icon',
      allowNull: false,
      defaultValue : ""
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
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
      field: 'createdAt'
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      field: 'updatedAt'
    }
  }, {
    tableName: 'categories'
  });
};
