const db = require("../models");
const helper = require("../helpers/helper");
const statistics = db.statistics;
const users = db.users;
const statistic_guestmultiples = db.statistic_guestmultiples;

// statistics.belongsTo(users, { as: "professionalData",foreignKey: "pro_id"  });
// statistics.belongsTo(users, {  as: "businessesData",foreignKey: "business_id" });
statistics.hasMany(statistic_guestmultiples, { foreignKey: "statistic_id" });

module.exports = {
  listing: async (req, res) => {
    try {
      if (!req.session.user) return res.redirect("/admin");

      const statisticslisting = await db.statistics.findAll({
        include: [
          {
            model: db.users,
            // as: "pro",
          },
          {
            model: db.businesses,
            // as: "business",
          },
        ],
        order: [["id", "DESC"]],
        raw: true,
        nest: true,
      });
      const user = await db.users.findOne({
        where: {
          id: req.session.user.id,
        },
        raw: true,
        nest: true,
      });
      let permision =
        user &&
        user.type === 4 &&
        JSON.parse(user.permission).permission.filter(function (e) {
          return e.Statistics;
        });

      let permi = permision ? permision[0]?.Statistics : "";

      res.render("statistics/listing", {
        statisticslisting,
        permi,
        type: user.type,
        session: req.session.user,
        msg: req.flash("msg"),
        title: "statistics",
      });
    } catch (error) {
      console.log("-----------------error is----------------------", error);
    }
  },

  delete: async (req, res) => {
    const result = await db.statistics.destroy({
      where: {
        id: req.body.id,
      },
    });
    if (result) {
      return res.json(1);
    }
    return res.json(0);
  },

  status: async (req, res) => {
    var result = await db.statistics.update(
      {
        status: req.body.status,
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
  },

  getBusinesses: async (req, res) => {
    try {
      var businessesArr = await db.businesses.findAll({
        where: { pro_id: req.body.professional_id },
      });

      if (businessesArr) {
        res.json(businessesArr);
      } else {
        res.json(0);
      }
    } catch (error) {
      console.log(error);
    }
  },

  getStatistics: async (req, res) => {
    try {
      let totalInfluencers = await db.bookings.count({
        where: {
          pro_id: req.body.professional_id,
          business_id: req.body.business_id,
        },
      });

      console.log(totalInfluencers, ";l;l;l;");

      const totalPartnership = await db.bookings.count({
        where: {
          pro_id: req.body.professional_id,
          business_id: req.body.business_id,
        },
      });

      var data = {
        total_influencers: totalInfluencers,
        total_partnerships: totalPartnership,
      };

      res.json(data);
    } catch (error) {
      console.log(error);
    }
  },

  addEdit: async (req, res) => {
    if (!req.session.user) return res.redirect("/admin");

    var statisticsArr = {};
    var businessesArr = null;
    if (req.params.id) {
      var arr = await db.statistics.findOne({
        where: { id: req.params.id },
        raw: true,
        nest: true,
      });
      if (arr) {
        var businessArr = await db.businesses.findAll({
          where: { pro_id: arr.pro_id },
          raw: true,
          nest: true,
        });
        businessesArr = businessArr;
        statisticsArr = arr;
      }
    }
    const statistics = await db.statistics.findAll({ raw: true, nest: true });
    const users = await db.users.findAll({
      where: {
        type: 3,
      },
      raw: true,
      nest: true,
    });

    const bookingcount = await db.bookings.count({});
    const user = await db.users.findOne({
      where: {
        id: req.session.user.id,
      },
    });
    let permision =
      user &&
      user.type === 4 &&
      JSON.parse(user.permission).permission.filter(function (e) {
        return e.Statistics;
      });

    let permi = permision ? permision[0]?.Statistics : "";

    res.render("statistics/statistic", {
      statistics,
      bookingcount,
      // bookingsnoofinfluencer,
      statisticsArr,
      users,
      permi,
      businessesArr,
      type: user.type,
      session: req.session.user,
      msg: req.flash("msg"),
      title: "statistics",
    });
  },

  addEditPost: async (req, res) => {
    try {
      if (req.body.id) {
        var response = await db.statistics.update(
          {
            influencer: req.body.influencer,
            pro_id: req.body.pro_id,
            no_stories: req.body.no_stories,
            no_views: req.body.no_views,
            money: req.body.money,
            partnership: req.body.partnership,
            business_id: req.body.business_id,
            statistics_of_the_month: req.body.statistics_of_the_month,
            campaign_performed: req.body.campaign_performed,
            number_of_interactions: req.body.number_of_interactions,
            best_influencer: req.body.best_influencer,
          },
          { where: { id: req.body.id } }
        );
        if (response) {
          req.flash("msg", " Statistics updated successfully");
        } else {
          req.flash("msg", " Statistics not updated");
        }
      } else {
        delete req.body.id;
        var response = await db.statistics.create(req.body);
        if (response) {
          req.flash("msg", " Statistics saved successfully");
        } else {
          req.flash("msg", " Statistics not saved");
        }
      }
      res.redirect("/admin/statistics");
    } catch (error) {
      console.log(error);
    }
  },

  view: async (req, res) => {
    if (!req.session.user) return res.redirect("/admin");
    let statisticss = await db.statistics.findOne({
      include: [
        {
          model: users,
          // as: "pro",
          // required: true,
        },
        {
          model: db.businesses,

          // required: true,
        },

        {
          model: db.statistic_guestmultiples,
        },
      ],

      where: { id: req.params.id },
      // raw: true,
      // nest: true,
    });
    // console.log(statisticss, ";l;lll;ll;");

    statmultidata = statisticss.statistic_guestmultiples;
    // console.log(statmultidata, "statisticssstatisticssstatisticssstatisticss");
    // statisticss = statisticss.toJSON();

    if (!req.session.user) return res.redirect("/admin");

    res.render("statistics/view", {
      statisticss,
      statmultidata,
      session: req.session.user,
      msg: req.flash("msg"),
      title: "statistics",
    });
  },
};
