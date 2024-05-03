const db = require("../models");
const helper = require("../helpers/helper");
var path = require("path");
var Sequelize = require("sequelize");
const Op = Sequelize.Op;

const users = db.users;
var sequelize = require("sequelize");
db.views.belongsTo(db.users, { foreignKey: "viewer_id" });
db.influencer_statistics.belongsTo(db.users, { foreignKey: "influencer_id" });

module.exports = {
  userslisting: async (req, res) => {
    if (!req.session.user) return res.redirect("/admin");
    var usersArr = await db.users.findAll({
      where: {
        type: 2,
      },
      raw: true,
      nest: true,
    });

    
    res.render("users/userslisting", {
      session: req.session.user,
      usersArr,
      msg: req.flash("msg"),
      title: "influencers",
    });
  },

  userstatus: async (req, res) => {
    var check = await db.users.update(
      {
        status: req.body.status,
      },
      {
        where: {
          id: req.body.id,
        },
      }
    );
    if (check) {
      return res.json(1);
    }
    return res.json(0);
  },

  userapproval: async (req, res) => {
    try {
      var result = await db.users.update(
        {
          is_approved: req.body.status,
        },
        {
          where: {
            id: req.body.id,
          },
        }
      );

      if (result) {
        return res.json(1);
      }
      return res.json(0);
    } catch (err) {
      console.log(err);
    }
  },

  userapprovalreject: async (req, res) => {
    try {
      var is_approved = await db.users.update(
        {
          is_approved: req.params.value,
        },
        {
          where: {
            id: req.params.id,
          },
        }
      );

      req.flash("msg", "Rejected  successfully");

      res.redirect("/userslisting");

      // res.send(false)
    } catch (err) {
      console.log(err);
    }
  },

  viewuser: async (req, res) => {
    if (!req.session.user) return res.redirect("/admin");
    let users = await db.users.findOne({
      attributes: {},
      where: { id: req.params.id },
    });

    var totalUsers = await db.users.count({ where: { type: { [Op.ne]: 1 } } });
    var viewsArr = await db.views.findAll({
      include: [
        {
          model: db.users,
          attributes: ["gender", "age"],
        },
      ],
      where: { influencer_id: req.params.id },
      raw: true,
      nest: true,
    });

    var femalePercentage =
      (100 * viewsArr.filter((data) => data.user.gender == 2).length) /
      totalUsers;
    var malePercentage =
      (100 * viewsArr.filter((data) => data.user.gender == 1).length) /
      totalUsers;

    // Less than 18
    var lessThanEighteen =
      (100 * viewsArr.filter((data) => data.user.age <= 18).length) /
      totalUsers;

    // In between 18-24

    var inBetweenEToTf =
      (100 *
        viewsArr.filter((data) => data.user.age >= 18 && data.user.age <= 24)
          .length) /
      totalUsers;

    // In between 25-34

    var inBetweenTfToTf =
      (100 *
        viewsArr.filter((data) => data.user.age >= 25 && data.user.age <= 34)
          .length) /
      totalUsers;

    // In between 35-44
    var inBetweenTfToFf =
      (100 *
        viewsArr.filter((data) => data.user.age >= 35 && data.user.age <= 44)
          .length) /
      totalUsers;

    // More than 44
    var moreThanFourtyFour =
      (100 * viewsArr.filter((data) => data.user.age >= 45).length) /
      totalUsers;

    var genderPercentage = {
      male: malePercentage,
      female: femalePercentage,
    };

    var agePercentage = {
      lessThanEighteen: lessThanEighteen,
      inBetweenEighteenToTwentyFour: inBetweenEToTf,
      inBetweenTwentyFiveToThirtyFour: inBetweenTfToTf,
      inBetweenThirtyFiveToFourtyFour: inBetweenTfToFf,
      moreThanFourtyFour: moreThanFourtyFour,
    };

    res.render("users/viewuser", {
      users,
      genderPercentage,
      agePercentage,
      session: req.session.user,
      msg: req.flash("msg"),
      title: "influencers",
    });
  },

  deleteuser: async (req, res) => {
    const result = await db.users.destroy({
      where: {
        id: req.body.id,
      },
    });

    if (result) {
      return res.json(1);
    }
    return res.json(0);
  },
  update_web_token: async (req, res) => {
    const user = await db.users.findOne({
      where: { id: req.body.id },
    });

    if (user) {
      var updateUser = await db.users.update(
        {
          device_token: req.body.WebToken,
        },
        {
          where: {
            id: req.body.id,
          },
        }
      );
      res.send(true);
    } else {
      res.send(false);
    }
  },

  statistics: async (req, res) => {
    try {
      if (!req.session.user) return res.redirect("/admin");

      var influencerStatisticsArr = await db.influencer_statistics.findAll({
        include: [{ model: db.users }],
        order: [["id", "DESC"]],
        raw:true,
        nest:true
      });

      res.render("influencer_statistics/listing", {
        session: req.session.user,
        influencerStatisticsArr,
        msg: req.flash("msg"),
        title: "influencer_statistics",
      });
    } catch (error) {
      console.log(error);
    }
  },

  addEdit: async (req, res) => {
    try {
      if (!req.session.user) return res.redirect("/admin");
      var influencerStatiscsArr = {};
      if (req.params.id) {
        influencerStatiscsArr = await db.influencer_statistics.findOne({
          where: { id: req.params.id },
          raw: true,
          nest: true,
        });
        if (influencerStatiscsArr) {
          var locationStatisticsArr = await db.location_statistics.findAll({
            where: { influencer_statistic_id: influencerStatiscsArr.id },
            raw: true,
            nest: true,
          });
          influencerStatiscsArr.locationStatisticsArr = locationStatisticsArr;
        }
      }
      var influencersArr = await db.users.findAll({
        where: { type: 2 },
        raw: true,
        nest: true,
      });

      const user = await db.users.findOne({
        where: {
          id: req.session.user.id,
        },
      });

      let permision =
        user &&
        user.type === 4 &&
        JSON.parse(user.permission).permission.filter(function (e) {
          return e.Influencers;
        });

      let permi = permision ? permision[0]?.Influencers : "";

      res.render("influencer_statistics/influencer_statistic", {
        session: req.session.user,
        users,
        msg: req.flash("msg"),
        title: "influencer_statistics",
        permi,
        influencerStatiscsArr,
        influencersArr,
        type: user.type,
      });
    } catch (error) {
      console.log(error);
    }
  },

  addEditPost: async (req, res) => {
    try {
      // console.log(req.body)
      // return
      if (!req.session.user) return res.redirect("/admin");
      var cnty_1 = req.body.country_one;
      var cnty_2 = req.body.country_two;
      var cnty_3 = req.body.country_three;

      var country_one = Array.isArray(cnty_1) ? cnty_1 : [cnty_1];
      var country_two = Array.isArray(cnty_2) ? cnty_2 : [cnty_2];
      var country_three = Array.isArray(cnty_3) ? cnty_3 : [cnty_3];

      var cnty_percentage_one = req.body.country_one_percentage;
      var cnty_percentage_two = req.body.country_two_percentage;
      var cnty_percentage_three = req.body.country_three_percentage;

      var country_one_percentage = Array.isArray(cnty_percentage_one)
        ? cnty_percentage_one
        : [cnty_percentage_one];
      var country_two_percentage = Array.isArray(cnty_percentage_two)
        ? cnty_percentage_two
        : [cnty_percentage_two];
      var country_three_percentage = Array.isArray(cnty_percentage_three)
        ? cnty_percentage_three
        : [cnty_percentage_three];

      var cty_1 = req.body.city_one;
      var cty_2 = req.body.city_two;
      var cty_3 = req.body.city_three;

    

      var city_one = Array.isArray(cty_1) ? cty_1 : [cty_1];
      var city_two = Array.isArray(cty_2) ? cty_2 : [cty_2];
      var city_three = Array.isArray(cty_3) ? cty_3 : [cty_3];

      var cty_percentage_one = req.body.city_one_percentage;
      var cty_percentage_two = req.body.city_two_percentage;
      var cty_percentage_three = req.body.city_three_percentage;

      var city_one_percentage = Array.isArray(cty_percentage_one)
        ? cty_percentage_one
        : [cty_percentage_one];
      var city_two_percentage = Array.isArray(cty_percentage_two)
        ? cty_percentage_two
        : [cty_percentage_two];
      var city_three_percentage = Array.isArray(cty_percentage_three)
        ? cty_percentage_three
        : [cty_percentage_three];

      var id;
      if (req.body.id) {
        id = req.body.id;
        var influencer_statistic_id = req.body.id;
        // delete req.body.id;
        var response = await db.influencer_statistics.update(req.body, {
          where: { id: influencer_statistic_id },
        });

        if (response) {
          await db.location_statistics.destroy({
            where: { influencer_statistic_id: influencer_statistic_id },
          });

          var message = "Influencer Statistic updated successfully";
        } else {
          var message = "Influencer Statistic not updated";
        }
      } else {
        delete req.body.id;
        var response = await db.influencer_statistics.create(req.body);
        if (response) {
          id = response.id;
          var message = "Influencer Statistic added successfully";
        } else {
          var message = "Influencer Statistic not added";
        }
      }

      if (country_one.length > 0) {
        for (let index = 0; index < country_one.length; index++) {
          await db.location_statistics.create({
            influencer_statistic_id: id,
            country_one: country_one[index],
            country_two: country_two[index],
            country_three: country_three[index],
            country_one_percentage: country_one_percentage[index],
            country_two_percentage: country_two_percentage[index],
            country_three_percentage: country_three_percentage[index],
            city_one_percentage: city_one_percentage[index],
            city_two_percentage: city_two_percentage[index],
            city_three_percentage: city_three_percentage[index],
            city_one: city_one[index],
            city_two: city_two[index],
            city_three: city_three[index],
          });
        }
      }
      req.flash("msg", message);
      res.redirect("/admin/influencer/statistics");
    } catch (error) {
      console.log(error);
    }
  },

  deleteInfluencerStatistics: async (req, res) => {
    try {
      var respons = await db.influencer_statistics.destroy({
        where: { id: req.body.id },
      });
      if (respons) {
        res.send("1");
      } else {
        res.send("0");
      }
    } catch (error) {
      console.log(error);
    }
  },

  view: async (req, res) => {
    try {
      if (!req.session.user) return res.redirect("/admin");
      let infliencerStatisticsArr = await db.influencer_statistics.findOne({
        where: { id: req.params.id },
      });

      if (infliencerStatisticsArr) {
        var locationstatisticsArr = await db.location_statistics.findAll({
          where: { influencer_statistic_id: infliencerStatisticsArr.id },
          raw: true,
          nest: true,
        });
        infliencerStatisticsArr.locationstatisticsArr = locationstatisticsArr;
      }
      console.log(infliencerStatisticsArr, ";l;l;l;");
      res.render("influencer_statistics/view", {
        infliencerStatisticsArr,
        session: req.session.user,
        msg: req.flash("msg"),
        title: "influencer_statistics",
      });
    } catch (error) {
      console.log(error);
    }
  },
};
