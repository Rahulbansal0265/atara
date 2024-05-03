const db = require("../models");
const database = require("../db/db");
const user = db.users;
const statistics = db.statistics;
const moment = require("moment");

module.exports = {
  dashboard: async (req, res) => {
    try {
      if (!req.session.user) return res.redirect("/admin");
      const usersCount = await db.users.count({ where: { type: 2 } });
      const proCount = await db.users.count({ where: { type: 3 } });
      const statisticsCount = await db.statistics.count({});
      const totalbookings = await db.bookings.count();
      const totalcategory = await db.categories.count();
      const totalweekselection = await db.our_selection_of_week.count();
      const todayTermAcceptedUser = await db.users.count();
      const currentDate = new Date();
      var day = ("0" + currentDate.getDate()).slice(-2);
      var month = ("0" + (currentDate.getMonth() + 1)).slice(-2);
      var year = currentDate.getFullYear();
      const todayDate = day + "-" + month + "-" + year;

      res.render("dashboard", {
        session: req.session.user,
        msg: req.flash("msg"),
        proCount,
        statisticsCount,
        totalbookings,
        totalcategory,
        totalweekselection,
        usersCount,
        todayTermAcceptedUser,
        todayDate,
        title: "dashboard",
      });
    } catch (error) {
      console.log("-----------------error is----------------------", error);
    }
  },
  chartData: async (req, res) => {
    try {
      //  console.log("hello",req.body,'-----------req.body--------')
      let userData = [];
      if (req.body.type == 1) {
        var getYear = new Date().getFullYear();

        var getMonth = new Date().getMonth() + 1;
        var providerData = [];

        var Totalmonth = 12;
        for (i = 1; i <= Totalmonth; i++) {
          if (i < 10) {
            var day = "0" + i;
          } else {
            day = i;
          }
          var fromDate = getYear + "-" + day + "-01";

          var endDate = getYear + "-" + day + "-30";
          user_query = await database.query(
            "select COUNT(*) as total from users where  date((`createdAt`)) between '" +
              fromDate +
              "' and '" +
              endDate +
              "' and is_accept=1 and type!=1",
            {
              model: user,
              mapToModel: true,
              type: database.QueryTypes.SELECT,
            }
          );
          if (user_query) {
            user_query = user_query.map((value) => {
              return value.toJSON();
            });
          }

          userData.push(user_query[0].total);
        }
      }
      if (req.body.type == 2) {
        let todayDate = moment().format("YYYY-MM-DD");
        //console.log(todayDate);
        // user_query = await database.query("select COUNT(*) as total from user where  date((`createdAt`)) between '" + todayDate + "' and '" + todayDate + "' and  status=1", {
        user_query = await database.query(
          "select COUNT(*) as total from users where  date((`createdAt`)) = '" +
            todayDate +
            "' and is_accept=1 and type!=1",
          {
            model: user,
            mapToModel: true,
            type: database.QueryTypes.SELECT,
          }
        );
        if (user_query) {
          user_query = user_query.map((value) => {
            return value.toJSON();
          });
        }

        userData.push(user_query[0].total);
        //console.log(userData);
        // userData = [10]
      }
      if (req.body.type == 3) {
        let startOfWeek = moment().startOf("week").format("YYYY-MM-DD");
        let endOfWeek = moment().endOf("week").format("YYYY-MM-DD");
        console.log(startOfWeek, endOfWeek, "----endOfWeek----");

        var currentDate = moment();

        var weekStart = currentDate.clone().startOf("isoWeek");
        var weekEnd = currentDate.clone().endOf("isoWeek");

        var days = [];

        for (var i = 0; i <= 6; i++) {
          days.push(moment(weekStart).add(i, "days").format("YYYY-MM-DD"));
        }
        // console.log(days);

        // var TotalDays = 6
        for (i = 0; i < days.length; i++) {
          user_query = await database.query(
            "select COUNT(*) as total from users where  date((`createdAt`)) = '" +
              days[i] +
              "' and is_accept=1 and type!=1",
            {
              model: user,
              mapToModel: true,
              type: database.QueryTypes.SELECT,
            }
          );
          if (user_query) {
            user_query = user_query.map((value) => {
              return value.toJSON();
            });
          }
          userData.push(user_query[0].total);
        }
        // userData = [10,15,85,36,54,48,78]
      }
      if (req.body.type == 4) {
        let currentYear = moment().format("YYYY");
        let currentMonth = moment().format("MM");
        let monthDate = moment(currentYear + "-" + currentMonth, "YYYY-MM");
        let daysInMonth = monthDate.daysInMonth();
        let arrDays = [];
        while (daysInMonth) {
          let current = moment().date(daysInMonth);
          arrDays.push(current.format("YYYY-MM-DD"));
          daysInMonth--;
        }
        arrDays = arrDays.reverse();

        for (i = 0; i < arrDays.length; i++) {
          user_query = await database.query(
            "select COUNT(*) as total from users where  date((`createdAt`)) = '" +
              arrDays[i] +
              "' and is_accept=1 and type!=1",
            {
              model: user,
              mapToModel: true,
              type: database.QueryTypes.SELECT,
            }
          );
          if (user_query) {
            user_query = user_query.map((value) => {
              return value.toJSON();
            });
          }
          userData.push(user_query[0].total);
        }
        // console.log(userData);return;
      }
      var responseData = { userData: userData };
      console.log(
        "--ddddddddddddddddddddddddddddddddd--responseData",
        responseData
      );
      res.json(responseData);
    } catch (error) {
      console.log(error);
      //helpers.error(res, error);
    }
  },
};
