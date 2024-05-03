var db = require("../models");
const uuid = require("uuid").v4;
const path = require("path");
module.exports = {
  terms: async (req, res) => {
    if (!req.session.user) return res.redirect("/admin");
    try {
      const data = await db.cms.findOne({
        where: {
          id: 1,
        },
      });
      console.log(">>>>>>>>>>>>>>>>>>>", data);

      res.render("cms/term&conditions", {
        data,
        session: req.session.user,
        msg: req.flash("msg"),
        title: "termconditions",
      });
    } catch (error) {
      console.log(">>>>>>>>note done>>>>>>>>>", error);
    }
  },
  update: async (req, res) => {
    try {
      console.log(
        "here is the length------------------",
        req.body.content.length
      );
      if (req.body.content === "") {
        req.flash("msg", "Please fill Something in Content");
        res.redirect("/termconditions");
      }

      const data = await db.cms.update(
        {
          title: req.body.title,
          content: req.body.content,
        },
        {
          where: {
            id: 1,
          },
        }
      );
      console.log(">>>>>>>>>>>>>>>>>>>>>>>", data);

      if (data == true) {
        req.flash("msg", " Terms & conditions updated successfully");

        res.redirect("/termconditions");
      } else {
        res.redirect("/dashboard");
      }
    } catch (error) {
      console.log("error", error);
    }
  },

  policy: async (req, res) => {
    if (!req.session.user) return res.redirect("/admin");
    try {
      const policy = await db.cms.findOne({
        where: {
          id: 2,
        },
      });

      res.render("cms/privacypolicy", {
        policy,
        session: req.session.user,
        msg: req.flash("msg"),
        title: "privacy",
      });
    } catch (error) {
      console.log(">>>>>>>>>>>>>>>>>>", error);
    }
  },
  policy_update: async (req, res) => {
    try {
      if (req.body.content == "") {
        req.flash("msg", "Please fill Something in Content");
        res.redirect("/privacy");
      }

      const data = await db.cms.update(
        {
          title: req.body.title,
          content: req.body.content,
        },
        {
          where: {
            id: 2,
          },
        }
      );
      console.log(">>>>>>>>>>>>>>>>>>>>>>>", data);

      if (data == true) {
        req.flash("msg", " Privacy & Policy updated Successfully");
        res.redirect("/privacy");
      } else {
        res.redirect("/dashboard");
      }
    } catch (error) {
      console.log(">>>>>>>>>>>>>>>>>", error);
    }
  },

  about: async (req, res) => {
    if (!req.session.user) return res.redirect("/admin");
    try {
      const about = await db.cms.findOne({
        where: {
          id: 3,
        },
      });
      console.log(">>>>>>>>>>>>>>>>>>>", about);

      res.render("cms/aboutus", {
        about,
        session: req.session.user,
        msg: req.flash("msg"),
        title: "aboutus",
      });
    } catch (error) {
      console.log(">>>>>>>>>>>>>>>>>>", error);
    }
  },
  update_about: async (req, res) => {
    if (req.body.content == "") {
      req.flash("msg", "Please fill something");
      res.redirect("/aboutus");
    }

    try {
      const data = await db.cms.update(
        {
          title: req.body.title,
          content: req.body.content,
        },
        {
          where: {
            id: 3,
          },
        }
      );
      console.log(">>>>>>>>>>>>>>>>>>>>>>>", data);

      if (data == true) {
        req.flash("msg", " About us Updated Successfully");

        res.redirect("/aboutus");
      } else {
        res.redirect("/dashboard");
      }
    } catch (error) {
      console.log(">>>>>>>>>>>>>>>>>", error);
    }
  },
};
