const db = require("../models");
const helper = require("../helpers/helper");
const businesses = db.businesses;
const business_images = db.business_images;
const users = db.users;
const category = db.categories;
// const uuidv4 = require('uuid').v4;
const { v4: uuidv4 } = require("uuid");
const path = require("path");

users.belongsTo(users, { foreignKey: "subadmin_id", as: "subadmin" });

module.exports = {
  listing: async (req, res) => {
    try {
      if (!req.session.user) return res.redirect("/admin");

      const businesslisting = await db.users.findAll({
        where: {
          subadmin_id: "145",
        },
        include: [
          {
            model: db.users,
            as: "subadmin",
            required: true,
          },
        ],
        order: [["id", "DESC"]],
      });
      console.log(businesslisting, "businesslistingbusinesslisting");
      res.render("team/listing", {
        businesslisting,
        session: req.session.user,
        msg: req.flash("msg"),
        title: "teams",
      });
    } catch (error) {
      console.log("-----------------error is----------------------", error);
    }
  },

  view: async (req, res) => {
    if (!req.session.user) return res.redirect("/admin");

    const business = await db.users.findOne(
      {
        include: [
          {
            model: db.users,
            as: "subadmin",
            required: true,
          },
        ],
        order: [["id", "DESC"]],

        where: { id: req.params.id },
      },
      (businessimage = await db.business_images.findAll({
        where: { business_id: req.params.id },
      }))
    );
    console.log("-------------------businessssssss", business);
    res.render("team/view", {
      businessimage,
      business,
      session: req.session.user,
      msg: req.flash("msg"),
      title: "teams",
    });
  },
};
