/* jshint indent: 1 */

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('messages', {
        id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            field: 'id'
        },
        message: {
            type: DataTypes.STRING(255),
            allowNull: false,
            field: 'message'
        },
        by_user: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            field: 'by_user'
        },
        to_user: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            field: 'to_user'
        },
    }, {
        sequelize,
        tableName: 'messages',
        timestamps: true,
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
