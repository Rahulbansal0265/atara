var express = require("express"),
  redirect = require("express-redirect");
var db = require("../models");
var app = express();
redirect(app);

module.exports = async (req, res, next) => {
  if (!req.session.user) {
    app.redirect("/subadminlogin");
  } else {
    var user_id = req.session.user.id;
    var userObj = await db.users.findOne({
      where: { id: user_id },
      raw: true,
      nest: true,
    });
    // console.log(userObj, "llllllllllllll");
    global.permission =
      userObj.permission != "" ? JSON.parse(userObj.permission) : "";
    global.type = userObj.type;
  }
  return next();
};
