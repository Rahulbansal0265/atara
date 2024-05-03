/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('bookings', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'id'
    },

    pro_id: {
      type: DataTypes.INTEGER(11),
      field: 'pro_id',
      allowNull: true
    },
    influencer_id: {
      type: DataTypes.INTEGER(11),
      field: 'influencer_id',
      allowNull: true
    },
    
    business_id: {
      type: DataTypes.STRING,
      field: 'business_id',
      allowNull: false
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false
    },
    time: {
      type: DataTypes.STRING(55),
      allowNull: false,
      defaultValue: '',
    },
    date: {
      type: DataTypes.STRING(55),
      allowNull: false,
      defaultValue: '',
    },
    number_of_people: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '0',
    },
    about_exp: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: '',
    },
    status: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '1',
      field: 'status'
    },
    booking_status: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '0',
      comment : "0=pending 1=accept 2=reject 3=expired"
    },
    storymad: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '1',
      field: 'storymad'
    },

    stat: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '1',
      field: 'stat'
    },
    was_influencer_present: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '1',
      field: 'was_influencer_present'
    },
    spec_date_format : {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: '',
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
    tableName: 'bookings'
  });
};
