/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('constant', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: 'id'
		},
		userid: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			field: 'userid'
		},
		product_id:{
			type: DataTypes.INTEGER(11),
			allowNull: true,
			field: 'product_id',
			defaultValue: 0,
		},
		user2Id: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			field: 'user2id'
		},
		lastMsgId: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			field: 'last_msg_id'
		},
		typing: {
			type: DataTypes.INTEGER(4),
			allowNull: true,
			defaultValue: '0',
			field: 'typing'
		},
		delete_id: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			field: 'delete_id',
			defaultValue:0
		},
		createdAt: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			defaultValue: '',
			field: 'created_at'
		},
		updatedAt: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			defaultValue: '',
			field: 'updated_at'
		}
	}, {
		tableName: 'constant',
		timestamps:false,
		hooks : {
			beforeCreate : (record, options) => {
				record.dataValues.createdAt = Math.round(new Date().getTime() / 1000);
				record.dataValues.updatedAt = Math.round(new Date().getTime() / 1000);
			},
			beforeUpdate : (record, options) => {
				record.dataValues.updatedAt = Math.round(new Date().getTime() / 1000);
				
			}
		}
	});
};
