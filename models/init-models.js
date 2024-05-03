var DataTypes = require("sequelize").DataTypes;
var _our_selection_of_week = require("./our_selection_of_week");

function initModels(sequelize) {
  var our_selection_of_week = _our_selection_of_week(sequelize, DataTypes);


  return {
    our_selection_of_week,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
