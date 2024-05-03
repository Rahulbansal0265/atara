const sequelize = require("sequelize");
const e = require("express");
var path = require("path");
const db = require("../models");
const bcrypt = require("bcrypt");
const helper = require("../helpers/helper");
const { v4: uuidv4 } = require("uuid");

module.exports = {
  listing: async function (req, res) {
    try {
      if (!req.session.user) return res.redirect("/admin");

      const subadminlisting = await db.users.findAll({
        where: {
          type: 4,
        },

        order: [["id", "DESC"]],
      });

      res.render("subAdmin/listing", {
        subadminlisting,
        session: req.session.user,
        msg: req.flash("msg"),
        title: "sub_admins",
      });
    } catch (error) {
      console.log(error);
    }
  },

  addEdit: async (req, res) => {
    try {
      if (!req.session.user) return res.redirect("/admin");

      var userObj = {};
      if (req.params.id) {
        userObj = await db.users.findOne({
          where: {
            id: req.params.id,
          },
          raw: true,
        });
        // const permission = subadminedit.permission;
      }
      res.render("subAdmin/sub_admin", {
        session: req.session.user,
        msg: req.flash("msg"),
        userObj,
        // permission,
        title: "sub_admins",
      });
    } catch (error) {
      console.log(error);
    }
  },

  addEditPost: async (req, res) => {
    try {
      var response = false;
      var user_password = await helper.bcryptHash(req.body.password);
      if (!req.body.id) {
        delete req.body.id;
        var checkEmail = await db.users.findOne({
          where: { email: req.body.email },
          raw: true,
        });
        if (checkEmail) {
          res.send("Email already exist");
        }
        const result = await db.users.create({
          full_name: req.body.full_name,
          phone: req.body.phone,
          email: req.body.email,
          password: user_password,
          type: req.body.type,
          permission: JSON.stringify({"module":[],"sub_module":[],"child":{}}),
        });

        if (result) {
          req.flash("msg", "Sub-Admin Added Successfully");
        } else {
          req.flash("msg", "Sub-Admin not added");
        }
      } else {
        var checkEmail = await db.users.findAll({
          where: { email: req.body.email },
        });
        if (checkEmail.length > 1) {
          res.send("Email already exist");
        }
        var result = await db.users.update(req.body, {
          where: { id: req.body.id },
        });
        if (result) {
          req.flash("msg", "Sub-Admin updated Successfully");
        } else {
          req.flash("msg", "Sub-Admin nor updated");
        }
      }
      res.redirect("/admin/sub_admins");
    } catch (error) {
      console.log(error);
    }
  },

  checkEmail: async (req, res) => {
    try {
      var where = { email: req.body.email };
      if (req.body.user_id) {
        where.id = req.body.user_id;
      }
      var checkOtherUser = await db.users.findOne({
        where: where,
      });

      if (checkOtherUser) {
        res.json("Email already exist");
      } else {
        res.json(true);
      }
    } catch (error) {
      console.log(error);
    }
  },

  permission: async (req, res) => {
    try {
      var permissionObj = await db.users.findOne({
        attributes: ["permission"],
        where: { id: req.params.id },
        raw: true,
        nest: true,
      });
      var permissionArr =
        permissionObj.permission !== ""
          ? JSON.parse(permissionObj.permission)
          : "";
      if (!Array.isArray(permissionArr.module) && permissionArr.module) {
        permissionArr.module = [permissionArr.module];
      }

      if (
        !Array.isArray(permissionArr.sub_module && permissionArr.sub_module)
      ) {
        permissionArr.sub_module = [permissionArr.sub_module];
      }

      console.log(permissionArr, "lllllllll");
      res.render("subAdmin/permissions", {
        session: req.session.user,
        sub_admin_id: req.params.id,
        permissionArr,
        msg: req.flash("msg"),
        title: "sub_admins",
      });
    } catch (error) {
      console.log(error);
    }
  },

  add: async function (req, res) {
    if (!req.session.user) return res.redirect("/admin");
    res.render("subAdmin/add", {
      session: req.session.user,
      msg: req.flash("msg"),
      title: "sub_admins",
    });
  },

  edit: async function (req, res) {
    // console.log(">>>>>>>>>>>>DSFFGFG>>>>>>>>>>>>>>>>>>>>>>>>>>>");return
    if (!req.session.user) return res.redirect("/admin");
    const subadminedit = await db.users.findOne({
      where: {
        id: req.params.id,
      },
      raw: true,
    });
    const permission = subadminedit.permission;

    //  console.log(permission,">>>>>>>>>>>>>>>>>>CC>X>C>CC>C>");return

    res.render("subAdmin/edit", {
      session: req.session.user,
      msg: req.flash("msg"),
      subadminedit,
      permission,
      title: "sub_admins",
    });
  },

  sub_admin_addpost: async (req, res) => {
    try {
      // image_name = "";

      const count = await db.users.count({
        where: {
          email: req.body.email,
        },
      });
      if (count > 0) {
        req.flash("msg", "Email already Exist");
        res.redirect("/addsubadmin");
        return;
      } else {
        // const user_password = crypto.createHash('sha1').update(req.body.password).digest('hex');
        const user_password = await helper.bcryptHash(req.body.password);

        // imagefield = await helper.uploadImage(req.files.image, "images")

        let data = {
          permission: [
            (Influencers = {
              Influencers:
                Array.isArray(req.body.Influencers) == true
                  ? req.body.Influencers
                  : req.body.Influencers == undefined
                  ? []
                  : [req.body.Influencers],
            }),
            (Categories = {
              Categories:
                Array.isArray(req.body.Categories) == true
                  ? req.body.Categories
                  : req.body.Categories == undefined
                  ? []
                  : [req.body.Categories],
            }),
            (Professionals = {
              Professionals:
                Array.isArray(req.body.Professionals) == true
                  ? req.body.Professionals
                  : req.body.Professionals == undefined
                  ? []
                  : [req.body.Professionals],
            }),
            (Business = {
              Business:
                Array.isArray(req.body.Business) == true
                  ? req.body.Business
                  : req.body.Business == undefined
                  ? []
                  : [req.body.Business],
            }),
            (Offer = {
              Offer:
                Array.isArray(req.body.Offer) == true
                  ? req.body.Offer
                  : req.body.Offer == undefined
                  ? []
                  : [req.body.Offer],
            }),
            (Statistics = {
              Statistics:
                Array.isArray(req.body.Statistics) == true
                  ? req.body.Statistics
                  : req.body.Statistics == undefined
                  ? []
                  : [req.body.Statistics],
            }),
            (Booking = {
              Booking:
                Array.isArray(req.body.Booking) == true
                  ? req.body.Booking
                  : req.body.Booking == undefined
                  ? []
                  : [req.body.Booking],
            }),
            (Contents = {
              Contents:
                Array.isArray(req.body.Contents) == true
                  ? req.body.Contents
                  : req.body.Contents == undefined
                  ? []
                  : [req.body.Contents],
            }),
          ],
        };

        console.log(data.permission[1]);
        console.log(JSON.stringify(data), ">GFGF>G>FG>F>>G>F>G>F");

        const adduser = await db.users.create({
          full_name: req.body.name,
          // image:imagefield,
          phone: req.body.phone,
          email: req.body.email,
          password: user_password,
          type: 4,
          permission: JSON.stringify(data),
        });

        // console.log(adduser,'adduseradduseradduseradduser');return;

        // const subadmin2 = await db.admin_details.create({
        //     user_id: sub_admin_add.id,

        // })

        req.flash("msg", "Sub-Admin Added Successfully");
        res.redirect("/subadminlisting");
      }
    } catch (error) {
      console.log(error);
    }
  },

  subadminpermissionedit: async function (req, res) {
    try {
      // console.log(req.body,">>>>>>>>>>>>>>>>>>>>>>>>>>Cdvdvcvv");return
      if (req.params.id) {
        let imagefield = req.params.image;
        if (req.files && req.files.image) {
          imagefield = await helper.uploadImage(req.files.image, "images");
        }

        let data = {
          permission: [
            (Influencers = {
              Influencers:
                Array.isArray(req.body.Influencers) == true
                  ? req.body.Influencers
                  : req.body.Influencers == undefined
                  ? []
                  : [req.body.Influencers],
            }),
            (Categories = {
              Categories:
                Array.isArray(req.body.Categories) == true
                  ? req.body.Categories
                  : req.body.Categories == undefined
                  ? []
                  : [req.body.Categories],
            }),
            (Professionals = {
              Professionals:
                Array.isArray(req.body.Professionals) == true
                  ? req.body.Professionals
                  : req.body.Professionals == undefined
                  ? []
                  : [req.body.Professionals],
            }),
            (Business = {
              Business:
                Array.isArray(req.body.Business) == true
                  ? req.body.Business
                  : req.body.Business == undefined
                  ? []
                  : [req.body.Business],
            }),
            (Offer = {
              Offer:
                Array.isArray(req.body.Offer) == true
                  ? req.body.Offer
                  : req.body.Offer == undefined
                  ? []
                  : [req.body.Offer],
            }),
            (Statistics = {
              Statistics:
                Array.isArray(req.body.Statistics) == true
                  ? req.body.Statistics
                  : req.body.Statistics == undefined
                  ? []
                  : [req.body.Statistics],
            }),
            (Booking = {
              Booking:
                Array.isArray(req.body.Booking) == true
                  ? req.body.Booking
                  : req.body.Booking == undefined
                  ? []
                  : [req.body.Booking],
            }),
            (Contents = {
              Contents:
                Array.isArray(req.body.Contents) == true
                  ? req.body.Contents
                  : req.body.Contents == undefined
                  ? []
                  : [req.body.Contents],
            }),
          ],
        };

        // console.log(data.permission[1])
        // console.log(data, ">GFGF>G>FG>F>>G>F>G>F");return

        const adduser = await db.users.update(
          {
            full_name: req.body.name,
            image: imagefield,
            phone: req.body.phone,
            email: req.body.email,
            // password: user_password,
            // role: 1,
            permission: JSON.stringify(data),
          },
          {
            where: {
              id: req.params.id,
            },
          }
        );

        req.flash("msg", "Sub-Admin Updated Successfully");
        res.redirect("/subadminlisting");
      }
    } catch (err) {
      console.log(err);
    }
  },

  delete: async function (req, res) {
    const data = await db.users.destroy({
      where: {
        id: req.body.id,
      },
    });

    res.json(1);
  },

  status: async (req, res) => {
    var result = await db.users.update(
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

  subadminlogin: async (req, res) => {
    res.render("subAdmin/login", { msg: req.flash("msg") });
  },

  subadminpost: async (req, res) => {
    try {
      const { email, password } = req.body;
      console.log(req.body);

      const getdata = await db.users.findOne({
        where: {
          email: req.body.email,
          status: 1,
        },
      });
      if (!getdata) {
        req.flash("msg", "This account is inactive. Kindly contact Admin");

        res.redirect("/subadminlogin");
        console.log("dscdsc");
      }
      // console.log(getdata,'getdatagetdatagetdata');
      if (getdata) {
        const comparepasswords = await bcrypt.compare(
          password,
          getdata.password
        );

        if (comparepasswords) {
          req.flash("msg", "Logged In successfully");

          console.log("right details");
          req.session.user = getdata;
          res.redirect("subadminDashboard");
        } else {
          req.flash("msg", "Please enter valid email and password");
          console.log("wrong pasword");
          res.redirect("/subadminlogin");
        }
      } else {
        res.redirect("/subadminlogin");
        console.log("Please enter valid email and password");
      }
    } catch (error) {
      console.log("------------------------------", error);
    }
  },

  dashboard: async (req, res) => {
    try {
      if (!req.session) return res.redirect("/subadminlogin");
      const usersCount = await db.users.count({ where: { type: 2 } });

      res.render("subAdmin/dashboard", {
        session: req.session.user,
        msg: req.flash("msg"),
        usersCount,
        title: "subadminDashboard",
      });
    } catch (error) {
      console.log("-----------------error is----------------------", error);
    }
  },

  logoutsubadmin: async (req, res) => {
    req.session.destroy((err) => {
      res.redirect("/subadminlogin"); // will always fire after session is destroyed
    });
  },

  changepassword: async (req, res) => {
    if (!req.session.user) return res.redirect("/subadminlogin");
    res.render("subAdmin/changepassword", {
      session: req.session.user,
      msg: req.flash("msg"),
      title: "",
    });
  },

  updatepassword: async (req, res) => {
    console.log(
      "This is body data<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",
      req.body
    );

    const oldpassword = req.body.oldpassword;
    const newpassword = req.body.newpassword;

    const newhashpassword = await bcrypt.hash(newpassword, 8);

    const check = await db.users.findOne({
      where: {
        id: req.session.user.id,
      },
    });

    if (check) {
      const isMatch = await bcrypt.compare(oldpassword, check.password);

      if (isMatch == true) {
        const updateadminprofile = await db.users.update(
          {
            password: newhashpassword,
          },
          {
            where: {
              id: req.session.user.id,
            },
          }
        );
        console.log(
          "<<<<<<<<<<<<<<<<<<update>>>>>>>>>>>>>>>>>>>>>",
          updateadminprofile
        );
        if (!req.session.user) return res.redirect("/subadminlogin");
        req.flash("msg", "Password updated sucessfully!!");

        res.redirect("/logoutsubadmin");
      } else {
        req.flash("msg", "Old password is not correct");
        res.redirect("/changepwdsubadmin");

        console.log(
          "<<<<<<<<<<<<<<<<YOU ENTERED BOTH DIFFERENT PASSWORDS>>>>>>>>>"
        );
      }
    }
  },

  myprofile: async (req, res) => {
    if (!req.session.user) return res.redirect("/subadminlogin");
    res.render("subAdmin/myprofile", {
      session: req.session.user,
      msg: req.flash("msg"),
      title: "",
    });
  },

  updateprofile: async (req, res) => {
    // This is code for image>>>>>>>>

    if (req.files && req.files.image) {
      var extension = path.extname(req.files.image.name);

      var fileImage = uuid() + extension;
      req.files.image.mv(
        process.cwd() + "/public/images/users/" + fileImage,
        function (err) {
          if (err) console.log(err);
        }
      );
    }

    // /This is code for image  <<<<<<<<<<<<

    try {
      console.log(req.session.user);
      const update = await db.users.update(
        {
          full_name: req.body.name,
          image: fileImage,
          email: req.body.email,
          // phone: req.body.phone,
        },
        {
          where: {
            id: req.session.user.id,
          },
        }
      );
      const addsession = await db.users.findOne({
        where: {
          email: req.session.user.email,
        },
      });

      req.session.user = addsession;

      console.log("update", update);

      if (!req.session.user) return res.redirect("/subadminlogin");

      req.flash("msg", "Profile updated sucessfully!!");

      res.redirect("/subadminDashboard");
    } catch (error) {
      console.log("error", error);
    }
  },

  addPostpermission: async (req, res) => {
    try {
      if (!req.session.user) return res.redirect("/admin");
      var data = req.body;
      console.log(data, "iiiiii");
      var module = [];
      var child = {};
      if ("influencer" in data) {
        if (!Array.isArray(data.influencer)) {
          child.influencer = [data.influencer];
        } else {
          child.influencer = data.influencer;
        }
        delete data.influencer;
      }
      if ("influencer_statistic" in data) {
        if (!Array.isArray(data.influencer_statistic)) {
          child.influencer_statistic = [data.influencer_statistic];
        } else {
          child.influencer_statistic = data.influencer_statistic;
        }
        delete data.influencer_statistic;
      }
      if ("professional" in data) {
        if (!Array.isArray(data.professional)) {
          child.professional = [data.professional];
        } else {
          child.professional = data.professional;
        }
        delete data.professional;
      }
      if ("business" in data) {
        if (!Array.isArray(data.business)) {
          child.business = [data.business];
        } else {
          child.business = data.business;
        }
        delete data.business;
      }
      if ("offer" in data) {
        if (!Array.isArray(data.offer)) {
          child.offer = [data.offer];
        } else {
          child.offer = data.offer;
        }
        delete data.offer;
      }
      if ("category" in data) {
        if (!Array.isArray(data.category)) {
          child.category = [data.category];
        } else {
          child.category = data.category;
        }
        delete data.category;
      }
      if ("statistic" in data) {
        if (!Array.isArray(data.statistic)) {
          child.statistic = [data.statistic];
        } else {
          child.statistic = data.statistic;
        }
        delete data.statistic;
      }
      if ("booking" in data) {
        if (!Array.isArray(data.booking)) {
          child.booking = [data.booking];
        } else {
          child.booking = data.booking;
        }
        delete data.booking;
      }

      data.child = child;
      // console.log(data,"oooooooooooooooooooooooooooooo")
      // return

      var result = await db.users.update(
        { permission: JSON.stringify(data) },
        { where: { id: req.body.sub_admin_id } }
      );
      if (result) {
        req.flash("msg", "Permissions added successfully");
      } else {
        req.flash("msg", "Permissions did not added");
      }
      res.redirect("/admin/sub_admins");
    } catch (error) {
      console.log(error);
    }
  },
};
