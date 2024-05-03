const db = require("../models");
const helper = require("../helpers/helper");
const businesses = db.businesses;
const business_images = db.business_images;
const users = db.users;
const category = db.categories;
const business_categories = db.business_categories;
const business_day_times = db.business_day_times;
const days = db.days;
days;
const axios = require('axios');

// const uuidv4 = require('uuid').v4;
const { v4: uuidv4 } = require("uuid");
const path = require("path");

businesses.belongsTo(users, { foreignKey: "pro_id" });
business_categories.belongsTo(category, { foreignKey: "category_id" });
db.businesses.hasMany(business_images, { foreignKey: "business_id" });
db.businesses.hasMany(business_categories, { foreignKey: "business_id" });
db.businesses.hasMany(business_day_times, { foreignKey: "business_id" });

module.exports = {
  
  index: async (req, res) => {
    try {
      if (!req.session.user) return res.redirect("/admin");

      const businesslisting = await db.businesses.findAll({
        include: [
          {
            model: db.users,
            required: true,
          },
        ],
        order: [["id", "DESC"]],
      });
      res.render("businesses/listing", {
        businesslisting,
        session: req.session.user,
        msg: req.flash("msg"),
        title: "businesses",
      });
    } catch (error) {
      console.log("-----------------error is----------------------", error);
    }
  },

  delete: async (req, res) => {
    const data = await db.businesses.destroy({
      where: {
        id: req.body.id,
      },
    });

    res.send("1");
  },

  status: async (req, res) => {
    var result = await db.businesses.update(
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

  add: async (req, res) => {
    if (!req.session.user) return res.redirect("/admin");
    const users = await db.users.findAll({
      where: {
        type: 3,
        status: 1,
      },
      raw: true,
      nest: true,
    });

    const categories = await db.categories.findAll({
      where: {
        status: 1,
      },
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
    var permi = "";
    var businessObj = {};
    var newArr = [];
    if (!req.params.id) {
      let permision =
        user &&
        user.type === 4 &&
        JSON.parse(user.permission).permission.filter(function (e) {
          return e.Business;
        });
      permi = permision ? permision[0]?.Business : "";
    } else {
      businessObj = await businesses.findOne({
        where: { id: req.params.id },
        raw: true,
        nest: true,
      });

      if (businessObj) {
        var categoriesArr = await business_categories.findAll({
          where: { business_id: businessObj.id },
          raw: true,
          nest: true,
        });

        if (categoriesArr) {
          for (let i in categoriesArr) {
            newArr.push(categoriesArr[i].category_id);
          }
        }

        var businessDayTimesArr = await business_day_times.findAll({
          where: { business_id: businessObj.id },
          raw: true,
          nest: true,
        });

        var businessImagesArr = await business_images.findAll({
          where: { business_id: businessObj.id },
        });
        if (businessImagesArr.length > 0) {
          businessObj.image = true;
          businessObj.imagesArr = businessImagesArr;
        }
        // var arr = [];
        for (let i in businessDayTimesArr) {
          var day = businessDayTimesArr[i].day;
          if (businessDayTimesArr[i].day == "Sunday") {
            businessObj.Sunday = {
              open_time: businessDayTimesArr[i].open_time,
              close_time: businessDayTimesArr[i].close_time,
              is_closed: businessDayTimesArr[i].is_closed,
            };
          }
          if (businessDayTimesArr[i].day == "Monday") {
            businessObj.Monday = {
              open_time: businessDayTimesArr[i].open_time,
              close_time: businessDayTimesArr[i].close_time,
              is_closed: businessDayTimesArr[i].is_closed,
            };
          }

          if (businessDayTimesArr[i].day == "Tuesday") {
            businessObj.Tuesday = {
              open_time: businessDayTimesArr[i].open_time,
              close_time: businessDayTimesArr[i].close_time,
              is_closed: businessDayTimesArr[i].is_closed,
            };
          }

          if (businessDayTimesArr[i].day == "Wednesday") {
            businessObj.Wednesday = {
              open_time: businessDayTimesArr[i].open_time,
              close_time: businessDayTimesArr[i].close_time,
              is_closed: businessDayTimesArr[i].is_closed,
            };
          }

          if (businessDayTimesArr[i].day == "Thursday") {
            businessObj.Thursday = {
              open_time: businessDayTimesArr[i].open_time,
              close_time: businessDayTimesArr[i].close_time,
              is_closed: businessDayTimesArr[i].is_closed,
            };
          }

          if (businessDayTimesArr[i].day == "Friday") {
            businessObj.Friday = {
              open_time: businessDayTimesArr[i].open_time,
              close_time: businessDayTimesArr[i].close_time,
              is_closed: businessDayTimesArr[i].is_closed,
            };
          }
          if (businessDayTimesArr[i].day == "Saturday") {
            businessObj.Saturday = {
              open_time: businessDayTimesArr[i].open_time,
              close_time: businessDayTimesArr[i].close_time,
              is_closed: businessDayTimesArr[i].is_closed,
            };
          }
        }
      }
    }
    console.log(businessObj, "llllllll");

    res.render("businesses/business", {
      permi,
      type: user.type,
      categories,
      users,
      newArr,
      businessObj,
      session: req.session.user,
      msg: req.flash("msg"),
      title: "businesses",
    });
  },

  addEditPost: async (req, res) => {
    try {
      var businessData = {
        pro_id: req.body.pro_id,
        name: req.body.name,
        location: req.body.location,
        description: req.body.description,
        insta: req.body.insta,
        facebook: req.body.facebook,
        tiktok: req.body.tiktok,
        facebook: req.body.facebook,
        youtube: req.body.youtube,
        latitude: req.body.lat,
        longitude: req.body.lng,
      };
      var business_id = null;
      if (!req.body.id) {
        var response = await businesses.create(businessData);
        if (response) {
          business_id = response.id;
        }
      } else {
        business_id = req.body.id;
        await businesses.update(businessData, { where: { id: req.body.id } });
        await business_categories.destroy({
          where: { business_id: req.body.id },
        });

        await business_day_times.destroy({
          where: { business_id: req.body.id },
        });

        // if (req.files) {
        //   await business_images.destroy({
        //     where: { business_id: req.body.id },
        //   });
        // }
      }

      // Save category
      var categoriesArr = req.body.category_id;
      if (!Array.isArray(req.body.category_id)) {
        categoriesArr = [categoriesArr];
      }

      for (let i in categoriesArr) {
        await business_categories.create({
          business_id: business_id,
          category_id: categoriesArr[i],
        });
      }
      // Save category end

      // Made correct array for time
      var arr = [];
      if (req.body.sunday != "on") {
        arr.push({
          day: "Sunday",
          open_time: req.body.sunday[0],
          close_time: req.body.sunday[1],
          is_closed: 0,
        });
      } else {
        arr.push({
          day: "Sunday",
          open_time: "",
          close_time: "",
          is_closed: 1,
        });
      }

      if (req.body.monday != "on") {
        arr.push({
          day: "Monday",
          open_time: req.body.monday[0],
          close_time: req.body.monday[1],
          is_closed: 0,
        });
      } else {
        arr.push({
          day: "Monday",
          open_time: "",
          close_time: "",
          is_closed: 1,
        });
      }

      if (req.body.tuesday != "on") {
        arr.push({
          day: "Tuesday",
          open_time: req.body.tuesday[0],
          close_time: req.body.tuesday[1],
          is_closed: 0,
        });
      } else {
        arr.push({
          day: "Tuesday",
          open_time: "",
          close_time: "",
          is_closed: 1,
        });
      }

      if (req.body.wednesday != "on") {
        arr.push({
          day: "Wednesday",
          open_time: req.body.wednesday[0],
          close_time: req.body.wednesday[1],
          is_closed: 0,
        });
      } else {
        arr.push({
          day: "Wednesday",
          open_time: "",
          close_time: "",
          is_closed: 1,
        });
      }

      if (req.body.thursday != "on") {
        arr.push({
          day: "Thursday",
          open_time: req.body.thursday[0],
          close_time: req.body.thursday[1],
          is_closed: 0,
        });
      } else {
        arr.push({
          day: "Thursday",
          open_time: "",
          close_time: "",
          is_closed: 1,
        });
      }

      if (req.body.friday != "on") {
        arr.push({
          day: "Friday",
          open_time: req.body.friday[0],
          close_time: req.body.friday[1],
          is_closed: 0,
        });
      } else {
        arr.push({
          day: "Friday",
          open_time: "",
          close_time: "",
          is_closed: 1,
        });
      }

      if (req.body.saturday != "on") {
        arr.push({
          day: "Saturday",
          open_time: req.body.saturday[0],
          close_time: req.body.saturday[1],
          is_closed: 0,
        });
      } else {
        arr.push({
          day: "Saturday",
          open_time: "",
          close_time: "",
          is_closed: 1,
        });
      }

      // Made correct array for time end

      // Save times
      for (let i in arr) {
        const dayMultiples = await db.business_day_times.create({
          business_id: business_id,
          day: arr[i].day,
          open_time: arr[i].open_time,
          close_time: arr[i].close_time,
          is_closed: arr[i].is_closed,
        });
      }

      // Save times end

      // Bulk Image Save
      if (req.files) {
        let arrImgName = [];
        if (req.files.images) {
          let imgdata = req.files.images;
          if (!Array.isArray(imgdata)) {
            imgdata = [req.files.images];
          }
          if (Array.isArray(imgdata)) {
            for (let data of imgdata) {
              let imageName = data.name;
              data.mv(
                path.join(__dirname + "/../public/images/" + imageName),
                (err) => {
                  if (err) {
                    return res.status(500).send(err);
                  }
                }
              );
              arrImgName.push(imageName);
            }
          }
        }
        let dataToSave = [];
        arrImgName.map((e) => {
          dataToSave.push({
            image: e,
            business_id: business_id,
          });
        });
        await db.business_images.bulkCreate(dataToSave);
      }
      // Bulk Image Save End
      res.redirect("/admin/businesses");
    } catch (error) {
      console.log(error);
    }
  },

  deleteImages: async (req, res) => {
    try {
      var result = await business_images.destroy({
        where: { id: req.body.id },
      });
      if (result) {
        res.json(1);
      } else {
        res.json(0);
      }
    } catch (error) {
      console.log(error);
    }
  },

  // add: async (req, res) => {
  //   if (!req.session.user) return res.redirect("/login");
  //   const statistics = await db.statistics.findAll({});
  //   const users = await db.users.findAll({
  //     where: {
  //       type: 3,
  //       status: 1,
  //     },
  //   });
  //   const categories = await db.categories.findAll({
  //     where: {
  //       status: 1,
  //     },
  //   });

  //   const user = await db.users.findOne({
  //     where: {
  //       id: req.session.user.id,
  //     },
  //   });

  //   let permision =
  //     user &&
  //     user.type === 4 &&
  //     JSON.parse(user.permission).permission.filter(function (e) {
  //       return e.Business;
  //     });

  //   let permi = permision ? permision[0]?.Business : "";

  //   res.render("businesses/add", {
  //     statistics,
  //     permi,
  //     type: user.type,
  //     categories,
  //     users,
  //     session: req.session.user,
  //     msg: req.flash("msg"),
  //     title: "addsbusiness",
  //   });
  // },

  // create: async (req, res) => {
  //   // console.log(req.body, "SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS");
  //   // return

  //   if (!req.session.user) return res.redirect("/login");

  //   const addbusiness = await db.businesses.create({
  //     pro_id: req.body.pro_id,
  //     name: req.body.name,
  //     youtube: req.body.youtube,
  //     insta: req.body.insta,
  //     facebook: req.body.facebook,
  //     tiktok: req.body.tiktok,
  //     location: req.body.location,
  //     description: req.body.description,
  //     status: 1,
  //   });
  //   console.log(
  //     "🚀 ~ file: businessController.js:152 ~ create: ~ addbusiness:",
  //     addbusiness
  //   );

  //   let arrImgName = [];
  //   if (req.files.images) {
  //     let imgdata = req.files.images;

  //     if (!Array.isArray(imgdata)) {
  //       imgdata = [req.files.images];
  //     }
  //     if (Array.isArray(imgdata)) {
  //       for (let data of imgdata) {
  //         let imageName = data.name;
  //         data.mv(
  //           path.join(__dirname + "/../public/images/" + imageName),
  //           (err) => {
  //             if (err) {
  //               return res.status(500).send(err);
  //             }
  //           }
  //         );
  //         arrImgName.push(imageName);
  //       }
  //     }
  //   }
  //   console.log(arrImgName, "===============================>");
  //   let dataToSave = [];
  //   arrImgName.map((e) => {
  //     console.log(e, "=======================");
  //     dataToSave.push({
  //       image: e,
  //       business_id: addbusiness.id,
  //     });
  //   });

  //   //category multiple code
  //   let data = await db.business_images.bulkCreate(dataToSave);

  //   var category_id = [];
  //   console.log(
  //     req.body.category_id,
  //     "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF"
  //   );
  //   req.body.category_id = Array.isArray(req.body.category_id)
  //     ? req.body.category_id
  //     : [req.body.category_id];

  //   for (let i in req.body.category_id) {
  //     console.log(req.body.category_id[i], "aaaaaaaaaaaaaaaaaaaaaaaaaa");

  //     const catmultiple = await db.business_categories.create({
  //       business_id: addbusiness.id,
  //       category_id: req.body.category_id[i],
  //     });
  //     console.log(
  //       "🚀 ~ file: businessController.js:201 ~ create: ~ catmultiple:",
  //       catmultiple
  //     );
  //   }

  //   var arr = [];
  //   if (req.body.sunday != "on") {
  //     arr.push({
  //       day: "Sunday",
  //       open_time: req.body.sunday[0],
  //       close_time: req.body.sunday[1],
  //       is_closed: 0,
  //     });
  //   } else {
  //     arr.push({ day: "Sunday", open_time: "", close_time: "", is_closed: 1 });
  //   }

  //   if (req.body.monday != "on") {
  //     arr.push({
  //       day: "Monday",
  //       open_time: req.body.monday[0],
  //       close_time: req.body.monday[1],
  //       is_closed: 0,
  //     });
  //   } else {
  //     arr.push({ day: "Monday", open_time: "", close_time: "", is_closed: 1 });
  //   }

  //   if (req.body.tuesday != "on") {
  //     arr.push({
  //       day: "Tuesday",
  //       open_time: req.body.tuesday[0],
  //       close_time: req.body.tuesday[1],
  //       is_closed: 0,
  //     });
  //   } else {
  //     arr.push({ day: "Tuesday", open_time: "", close_time: "", is_closed: 1 });
  //   }

  //   if (req.body.wednesday != "on") {
  //     arr.push({
  //       day: "Wednesday",
  //       open_time: req.body.wednesday[0],
  //       close_time: req.body.wednesday[1],
  //       is_closed: 0,
  //     });
  //   } else {
  //     arr.push({
  //       day: "Wednesday",
  //       open_time: "",
  //       close_time: "",
  //       is_closed: 1,
  //     });
  //   }

  //   if (req.body.thursday != "on") {
  //     arr.push({
  //       day: "Thursday",
  //       open_time: req.body.thursday[0],
  //       close_time: req.body.thursday[1],
  //       is_closed: 0,
  //     });
  //   } else {
  //     arr.push({
  //       day: "Thursday",
  //       open_time: "",
  //       close_time: "",
  //       is_closed: 1,
  //     });
  //   }

  //   if (req.body.friday != "on") {
  //     arr.push({
  //       day: "Friday",
  //       open_time: req.body.friday[0],
  //       close_time: req.body.friday[1],
  //       is_closed: 0,
  //     });
  //   } else {
  //     arr.push({ day: "Friday", open_time: "", close_time: "", is_closed: 1 });
  //   }

  //   if (req.body.saturday != "on") {
  //     arr.push({
  //       day: "Saturday",
  //       open_time: req.body.saturday[0],
  //       close_time: req.body.saturday[1],
  //       is_closed: 0,
  //     });
  //   } else {
  //     arr.push({
  //       day: "Saturday",
  //       open_time: "",
  //       close_time: "",
  //       is_closed: 1,
  //     });
  //   }

  //   for (let i in arr) {
  //     const dayMultiples = await db.business_day_times.create({
  //       business_id: addbusiness.id,
  //       day: arr[i].day,
  //       open_time: arr[i].open_time,
  //       close_time: arr[i].close_time,
  //       is_closed: arr[i].is_closed,
  //     });
  //   }

  //   req.flash("msg", " Business created successfully");

  //   res.redirect("/businesslisting");
  // },

  // edit: async (req, res) => {
  //   if (!req.session.user) return res.redirect("/login");

  //   var bussinessObj = await db.businesses.findOne({
  //     where: { id: req.params.id },
  //     raw: true,
  //     nest: true,
  //   });
  //   console.log(
  //     bussinessObj,
  //     "hereeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
  //   );

  //   let users = await db.users.findAll({
  //     where: {
  //       type: 3,
  //       status: 1,
  //     },
  //   });
  //   console.log(users, "fgjafdjahfdajhdfajhf");
  //   var bussinessDayTimesArr = [];
  //   var bussinessCategoriesArr = [];
  //   var bussinessImagesArr = [];
  //   if (bussinessObj) {
  //     // bussinessDayTimesArr = await db.business_day_times.findAll({
  //     //   where: { business_id: bussinessObj.id },
  //     //   raw: true,
  //     //   nest: true,
  //     // });

  //     bussinessCategoriesArr = await db.business_categories.findAll({
  //       include: [{ model: db.categories }],
  //       where: { business_id: bussinessObj.id },
  //       raw: true,
  //       nest: true,
  //     });

  //     bussinessImagesArr = await db.business_images.findAll({
  //       where: { business_id: bussinessObj.id },
  //       raw: true,
  //       nest: true,
  //     });

  //     var categories = await db.business_categories.findAll({
  //       where: { business_id: req.params.id },
  //       raw: true,
  //     });
  //   }
  //   //bussinessObj.bussinessDayTimesArr = bussinessDayTimesArr;
  //   bussinessObj.bussinessCategoriesArr = bussinessCategoriesArr;
  //   bussinessObj.bussinessImagesArr = bussinessImagesArr;
  //   const allCategories = await db.categories.findAll({});
  //   console.log(bussinessObj);
  //   let busSunday = await db.business_day_times.findOne({
  //     where: {
  //       business_id: req.params.id,
  //       day: "Sunday",
  //     },
  //   });
  //   let busmonday = await db.business_day_times.findOne({
  //     where: {
  //       business_id: req.params.id,
  //       day: "Monday",
  //     },
  //   });
  //   let bustuesday = await db.business_day_times.findOne({
  //     where: {
  //       business_id: req.params.id,
  //       day: "Tuesday",
  //     },
  //   });
  //   let buswednesday = await db.business_day_times.findOne({
  //     where: {
  //       business_id: req.params.id,
  //       day: "Wednesday",
  //     },
  //   });
  //   let busthursday = await db.business_day_times.findOne({
  //     where: {
  //       business_id: req.params.id,
  //       day: "Thursday",
  //     },
  //   });
  //   let busfriday = await db.business_day_times.findOne({
  //     where: {
  //       business_id: req.params.id,
  //       day: "Friday",
  //     },
  //   });
  //   let bussaturday = await db.business_day_times.findOne({
  //     where: {
  //       business_id: req.params.id,
  //       day: "Saturday",
  //     },
  //   });
  //   console.log(busSunday, "amitt heree    ");
  //   console.log(busmonday, "amitt heree    ");

  //   res.render("business/edit", {
  //     categories,
  //     allCategories,
  //     bussinessObj,
  //     users,
  //     busSunday,
  //     busmonday,
  //     bustuesday,
  //     buswednesday,
  //     busthursday,
  //     busfriday,
  //     bussaturday,
  //     session: req.session.user,
  //     msg: req.flash("msg"),
  //     title: "editbusiness",
  //   });

  //   return;

  //   // const users = await db.users.findAll({
  //   //   where: {
  //   //     type: 3,
  //   //     status: 1,
  //   //   },
  //   // });
  //   // const categories = await db.categories.findAll({});

  //   // const business_day_time = await db.days.findAll({});

  //   // const businessimage = await db.business_images.findAll({
  //   //   where: { business_id: req.params.id },
  //   // });

  //   // const editstistics = await db.businesses.findOne({
  //   //   include: [
  //   //     {
  //   //       model: db.business_images,
  //   //       required: true,
  //   //     },
  //   //     {
  //   //       model: db.business_day_times,
  //   //     },
  //   //   ],
  //   //   where: { id: req.params.id },
  //   // });

  //   // let get_business_categogy = await db.business_categories.findAll({
  //   //   where: { business_id: req.params.id },
  //   //   raw: true,
  //   // });
  //   // let catIds = [];
  //   // for (let i in get_business_categogy) {
  //   //   catIds.push(get_business_categogy[i].category_id);
  //   // }

  //   // let get_business_daytimes = await db.business_day_times.findAll({
  //   //   where: { business_id: req.params.id },
  //   //   raw: true,
  //   //   nest: true,
  //   // });
  //   // // console.log(
  //   // //   "🚀 ~ file: businessController.js:271 ~ edit: ~ get_business_daytimes:",
  //   // //   get_business_daytimes
  //   // // );
  //   // let dayz = [];
  //   // for (let i in get_business_daytimes) {
  //   //   dayz.push(get_business_daytimes[i].day);
  //   // }

  //   // const data = editstistics.business_day_times;
  //   // console.log("🚀 ~ file: businessController.js:273 ~ edit: ~ data:", data);

  //   // //     console.log(dayz,'--get_business_day---')

  //   // res.render("business/edit", {
  //   //   data,
  //   //   business_day_time,
  //   //   businessimage,
  //   //   dayz,
  //   //   catIds,
  //   //   users,
  //   //   categories,
  //   //   session: req.session.user,
  //   //   msg: req.flash("msg"),
  //   //   editstistics,
  //   //   title: "editbusiness",
  //   // });
  // },

  editTimedetail: async (req, res) => {
    if (!req.session.user) return res.redirect("/admin");

    const editstistics = await db.business_day_times.findOne({
      where: { id: req.params.id },
    });

    res.render("business/edittime", {
      session: req.session.user,
      msg: req.flash("msg"),
      editstistics,
      title: "businesses",
    });
  },

  update: async (req, res) => {
    const lastdata = await db.businesses.findOne({
      where: { id: req.params.id },
    });
    const updatebusiness = await db.businesses.update(
      {
        pro_id: req.body.pro_id,
        name: req.body.name,
        location: req.body.location,
        // open_time: req.body.open_time,
        // close_time: req.body.close_time,
        facebook: req.body.facebook,
        tiktok: req.body.tiktok,
        insta: req.body.insta,
        youtube: req.body.youtube,

        description: req.body.description,
      },
      {
        where: { id: req.params.id },
      }
    );

    // console.log(updatebusiness.id,'=========================');return;
    var cat = [];
    if (!Array.isArray(req.body.category_id)) {
      console.log("object");
      cat.push(req.body.category_id);
    } else {
      cat = req.body.category_id;
    }
    for (let i in cat) {
      let isCatAvail = await db.business_categories.findOne({
        where: { business_id: req.params.id, category_id: cat[i] },
        raw: true,
      });
      if (!isCatAvail) {
        await db.business_categories.create({
          business_id: req.params.id,
          category_id: cat[i],
        });
      } else {
        await db.business_categories.update(
          { business_id: req.params.id, category_id: cat[i] },
          {
            where: { id: isCatAvail.id },
          }
        );
      }
    }

    if (req.files) {
      let imgdata = req.files.images;
      let arrImgName = [];

      if (!Array.isArray(imgdata)) {
        imgdata = [req.files.images];
      }
      if (Array.isArray(imgdata)) {
        for (let data of imgdata) {
          let imageName = data.name;
          data.mv(
            path.join(__dirname + "/../public/images/" + imageName),
            (err) => {
              if (err) {
                return res.status(500).send(err);
              }
            }
          );
          arrImgName.push(imageName);
        }
      }

      let dataToSave = [];
      arrImgName.map((e) => {
        // console.log(e, "=======================");
        dataToSave.push({
          image: e,
          business_id: req.params.id,
        });
      });

      // console.log(dataToSave, "==================");

      let data = await db.business_images.bulkCreate(dataToSave);
    }
    let editDay = req.body.day;
    let open_time = req.body.open_time;
    let close_time = req.body.close_time;
    let bussiness_id = req.body.bussiness_id;
    let is_closed = req.body.is_closed;
    // let arr = [];
    let obj = {};
    // for (const i in editDay) {
    //   for (const j in open_time) {
    //     for (const k in close_time) {
    //       for (const l in bussiness_id) {
    //         for (const m in is_closed) {
    //           obj = {
    //             day: editDay[i],
    //             open_time: open_time[j],
    //             close_time: close_time[k],
    //             bussiness_id: bussiness_id[l],
    //             is_closed: is_closed[m],
    //           };
    //         }
    //       }
    //     }
    //   }
    //   arr.push(obj);
    // }

    // console.log(req.body);
    // console.log("🚀 ~ file: businessController.js:379 ~ update: ~ arr:", arr);

    if (req.body.category_id) {
      await db.business_categories.destroy({
        where: {
          business_id: req.params.id,
        },
      });
      req.body.category_id = Array.isArray(req.body.category_id)
        ? req.body.category_id
        : [req.body.category_id];

      for (let i in req.body.category_id) {
        // console.log(req.body.category_id[i], "aaaaaaaaaaaaaaaaaaaaaaaaaa");

        const catmultiple = await db.business_categories.create({
          business_id: req.params.id,
          category_id: req.body.category_id[i],
        });
      }
    }
    // category_id.push(catmultiple)

    await db.business_day_times.destroy({
      where: {
        business_id: req.params.id,
      },
    });
    // await db.business_day_times.bulkCreate(arr);

    // req.body.day = Array.isArray(req.body.day)
    //   ? req.body.day
    //   : [req.body.day];
    var day = [];
    req.body.day = Array.isArray(req.body.day) ? req.body.day : [req.body.day];

    for (let i in req.body.day) {
      let is_closed = req.body.is_closed[i] == "on" ? 1 : 0;

      const dayMultiples = await db.business_day_times.create({
        business_id: req.params.id,
        day: req.body.day[i],
        open_time: req.body.open_time[i],
        close_time: req.body.close_time[i],
        is_closed: is_closed,
      });
    }
    // for (let i in req.body.day) {
    //   console.log(req.body.close_time[i], "aaaaaaaaaaaaaaaaaaaaaaaaaa");
    //   if (req.body.day[i] != " ") {
    //     const catmultiple = await db.business_day_times.update({
    //       business_id: req.params.id,
    //       day: req.body.day[i],
    //       close_time: req.body.close_time[i],
    //       open_time: req.body.open_time[i],

    //     }, {
    //       where: {
    //         business_id: req.params.id,
    //       }
    //     }
    //     );
    //   }
    // }

    req.flash("msg", " Business updated successfully");

    res.redirect("/businesslisting");
  },
  updatebusinessTime: async (req, res) => {
    const lastdata = await db.business_day_times.findOne({
      where: { id: req.params.id },
    });

    const updatebusiness = await db.business_day_times.update(
      {
        open_time: req.body.open_time,
        close_time: req.body.close_time,
      },
      {
        where: { id: req.params.id },
      }
    );

    req.flash("msg", " Business time details updated successfully");

    res.redirect("/businesslisting");
  },

  view: async (req, res) => {
    if (!req.session.user) return res.redirect("/admin");

    const business = await db.businesses.findOne({
      include: [
        {
          model: db.users,
          required: true,
        },

        {
          model: db.business_images,
        },
        {
          model: db.business_day_times,
          order: ["day", "DESC"],
        },

        {
          model: db.business_categories,

          include: [
            {
              model: db.categories,
            },
          ],
        },
      ],
      order: [["id", "DESC"]],

      where: { id: req.params.id },
    });
    console.log(
      "🚀 ~ file: businessController.js:720 ~ view: ~ business:",
      business
    );
    const businesimg = business.business_images;
    const businescat = business.business_categories;
    const business_day_time_details = business.business_day_times;

    console.log(
      "-------------------businescat]]]]]]]]]]]]]]]]businesimg",
      business
    );
    res.render("businesses/view", {
      business,
      business_day_time_details,
      businesimg,
      businescat,
      session: req.session.user,
      msg: req.flash("msg"),
      title: "businesses",
    });
  },

  deleteTimedetails: async (req, res) => {
    const data = await db.business_day_times.destroy({
      where: {
        id: req.body.id,
      },
    });

    res.send("1");
  },
};
