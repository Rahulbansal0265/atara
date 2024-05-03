/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('follows', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: 'id'
		},
		user_id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			defaultValue: '0',
			field: 'user_id'
		},
		user2id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			defaultValue: '0',
			field: 'user2id'
		},
		status: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			defaultValue: '1',
			field: 'status'
		},
		type: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			defaultValue: '0',
			field: 'type'
		},
		createdAt: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			defaultValue: '0',
			field: 'createdAt'
		},
		updatedAt: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			defaultValue: '0',
			field: 'updatedAt'
		}
	}, {
		tableName: 'follows',
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
