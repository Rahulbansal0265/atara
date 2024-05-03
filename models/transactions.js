/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('transactions', {
		id: {
			type: DataTypes.BIGINT,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: 'id'
		},
		userId: {
			type: DataTypes.BIGINT,
			allowNull: false,
			field: 'userId'
		},
		orderId: {
			type: DataTypes.BIGINT,
			allowNull: false,
			field: 'orderId'
		},
		totalAmount: {
			type: DataTypes.FLOAT,
			allowNull: false,
			field: 'totalAmount'
		},
		refund_price: {
			type: DataTypes.FLOAT,
			allowNull: false,
			field: 'refund_price'
		},
		paymentMethod: {
			type: DataTypes.INTEGER(1),
			allowNull: false,
			defaultValue: '1',
			field: 'paymentMethod'
		},
		paymentStatus: {
			type: DataTypes.STRING(100),
			allowNull: false,
			field: 'paymentStatus'
		},
		is_complete: {
			type: DataTypes.INTEGER(1),
			allowNull: false,
			defaultValue: 0
		},
		card_id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			defaultValue: 0
		},
		card_number: {
			type: DataTypes.STRING(255),
			allowNull: false,
			defaultValue: ''
		},
		payer_id: {
			type: DataTypes.STRING(255),
			allowNull: false,
			defaultValue: ''
		},
		created: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			field: 'created'
		},
		updated: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			field: 'updated'
		},
		created_at: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
		},
		updated_at: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
		},
	},{
		tableName: 'transactions',
		timestamps: false,
		hooks : {
		  beforeCreate : (record, options) => {
			record.dataValues.created = Math.round(new Date().getTime() / 1000);
			record.dataValues.updated = Math.round(new Date().getTime() / 1000);
		  },
		  beforeUpdate : (record, options) => {
			record.dataValues.updated = Math.round(new Date().getTime() / 1000);
		  },
		  beforeBulkCreate : (records, options) => {
			if (Array.isArray(records)) {
			  records.forEach(function (record) {
				record.dataValues.created = Math.round(new Date().getTime() / 1000);
				record.dataValues.updated = Math.round(new Date().getTime() / 1000);
			  });
			}
		  },
		  beforeBulkUpdate : (records, options) => {
			if (Array.isArray(records)) {
			  records.forEach(function (record) {
				record.dataValues.updated = Math.round(new Date().getTime() / 1000);
			  });
			}
		  }
		}
	});
};
