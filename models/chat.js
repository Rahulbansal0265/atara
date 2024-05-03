/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('chat', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			primaryKey: true,
			autoIncrement: true,
			field: 'id'
		},
		userid: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			field: 'userid'
		},
		user2Id: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			field: 'user2id'
		},
		constantid: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			field: 'constantid'
		},
		 product_id: {
		 	type: DataTypes.INTEGER(11),
			allowNull: true,
		 	field: 'product_id',
			 defaultValue:0
		 },
		message: {
			type: DataTypes.TEXT,
			allowNull: true,
			field: 'message'
		},
		msg_type: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			field: 'msg_type',
			defaultValue:0
		},
		deletedId: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			field: 'deleted_id',
			defaultValue:'0'
		},
		readStatus: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			field: 'read_status',
			defaultValue:0
		},
		createdAt: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			defaultValue: '0',
			field: 'created_at'
		},
		updatedAt: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			defaultValue: '0',
			field: 'updated_at'
		}
	}, {
		tableName: 'chat',
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
