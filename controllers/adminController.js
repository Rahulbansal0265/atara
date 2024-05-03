const sequelize = require("sequelize");
const e = require("express");
var path = require("path");
const db = require("../models");
const bcrypt = require("bcrypt");
const uuid = require("uuid").v4;
const helper = require("../helpers/helper");

// const e = require('express');

module.exports = {
  login: async (req, res) => {
    res.render("login", { msg: req.flash("msg"), title: "" });
  },

  Inlogin: async (req, res) => {
    try {
      const { email, password } = req.body;
      const getdata = await db.users.findOne({
        where: {
          email: req.body.email,
          type: { [sequelize.Op.or]: [1, 4] },
        },
      });
      if (!getdata) {
        req.flash("msg", "Please enter valid email and password");
        return res.redirect("/admin");
      }
      const comparepasswords = await bcrypt.compare(password, getdata.password);
      if (!comparepasswords) {
        req.flash("msg", "Please enter valid email and password");
        res.redirect("/admin");
      }
      req.session.user = getdata;
    //   res.cookie("cookieName", getdata, { httpOnly: true });
      req.flash("msg", "Logged in successfully");
      res.redirect("/admin/dashboard");
    } catch (error) {
      console.log("------------------------------", error);
    }
  },

  myprofile: async (req, res) => {
    if (!req.session.user) return res.redirect("/login");
    res.render("myprofile", {
      session: req.session.user,
      msg: req.flash("msg"),
      title: "",
    });
  },

  updateprofile: async (req, res) => {
    // This is code for image>>>>>>>>
     if (!req.session.user) return res.redirect("/admin");

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

     

      req.flash("msg", "Profile updated sucessfully!!");

      res.redirect("/admin/dashboard");
    } catch (error) {
      console.log("error", error);
    }
  },

  changepassword: async (req, res) => {
    if (!req.session.user) return res.redirect("/admin");
    res.render("changepassword", {
      session: req.session.user,
      msg: req.flash("msg"),
      title: "",
    });
  },

  updatepassword: async (req, res) => {

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
        if (!req.session.user) return res.redirect("/login");
        req.flash("msg", "Password updated sucessfully!!");

        res.redirect("/logout");
      } else {
        req.flash("msg", "Old password is not correct");
        res.redirect("/changepassword");

        console.log(
          "<<<<<<<<<<<<<<<<YOU ENTERED BOTH DIFFERENT PASSWORDS>>>>>>>>>"
        );
      }
    }
  },

  logout: async (req, res) => {
    req.session.destroy((err) => {
      res.redirect("/admin");
    });
  },

  recover_password: async (req, res) => {
    res.render("login_password_recover", { title: "" });
  },
  forgot_password: async function (req, res) {
    try {
      const required = {
        email: req.body.email,
      };
      const nonRequired = {};
      let requestdata = await helper.vaildObjectApi(required, nonRequired);
      const user = await db.users.findOne({
        where: {
          email: req.body.email,
        },
        raw: true,
      });

      if (!user) {
        return helper.error(res, "This email does'nt exist");
      }
      requestdata.otp = Math.floor(1000 + Math.random() * 9000);
      let otpUpdate = await db.users.update(
        {
          otp: requestdata.otp,
        },
        {
          where: { id: user.id },
        }
      );
      console.log(otpUpdate);
      let forgot_user_password = await helper.send_email(requestdata, req, res);

      let msg = "Email has been sent to your registered email";
      req.flash("msg", "Email has been sent to your registered email");
      res.redirect("/login");
    } catch (err) {
      helper.error(res, err);
    }
  },
};
