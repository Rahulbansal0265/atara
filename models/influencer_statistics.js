module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "influencer_statistics",
    {
      id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "id",
      },
      influencer_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      less_than_eighteen: {
        type: DataTypes.INTEGER,
        defaultValue: "0",
      },
      eighteen_to_twentyFour: {
        type: DataTypes.INTEGER,
        defaultValue: "0",
      },
      twentyFive_to_thirtyFour: {
        type: DataTypes.INTEGER,
        defaultValue: "0",
      },
      thirtyFive_to_fourtyFour: {
        type: DataTypes.INTEGER,
        defaultValue: "0",
      },
      moreThan_fourtyFour: {
        type: DataTypes.INTEGER,
        defaultValue: "0",
      },
      male: {
        type: DataTypes.INTEGER,
        defaultValue: "0",
      },
      female: {
        type: DataTypes.INTEGER,
        defaultValue: "0",
      },
      view_avg: {
        type: DataTypes.INTEGER,
        defaultValue: "0",
      },
    },
    {
      sequelize,
      tableName: "influencer_statistics",
      timestamps: true,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "id" }],
        },
      ],
    }
  );
};
