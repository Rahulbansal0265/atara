const db = require("../models");
const helper = require("../helpers/helper");
var path = require("path");
var Sequelize = require("sequelize");
const Op = Sequelize.Op;
const nodemailer = require('nodemailer');

const users = db.users;
var sequelize = require("sequelize");
const moment = require("moment");

module.exports = {
  listing: async (req, res) => {
    if (!req.session.user) return res.redirect("/admin");
    let professionalsArr = await db.users.findAll({
      where: {
        type: 3,
      },
      order: [["id", "DESC"]],
      raw: true,
      nest: true,
    });
    res.render("pro/listing", {
      session: req.session.user,
      professionalsArr,
      msg: req.flash("msg"),
      title: "professionals",
    });
    // }
  },

  changeStatus: async (req, res) => {
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

  view: async (req, res) => {
    let users = await db.users.findOne({
      attributes: {},
      where: { id: req.params.id },
    });
    users = users.toJSON();

    if (!req.session.user) return res.redirect("/admin");

    res.render("pro/view", {
      users,
      session: req.session.user,
      msg: req.flash("msg"),
      title: "professionals",
    });
  },

  deleteuser: async (req, res) => {
    const data = await db.users.destroy({
      where: {
        id: req.body.id,
      },
    });

    res.send("1");
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

  add: async (req, res) => {
    if (!req.session.user) return res.redirect("/admin");

    const userpermission = await db.users.findOne({
      where: {
        id: req.session.user.id,
      },
    });

    let permision =
      userpermission &&
      userpermission.type === 4 &&
      JSON.parse(userpermission.permission).permission.filter(function (e) {
        return e.Professionals;
      });
    console.log(permision);
    let permi = permision ? permision[0]?.Professionals : "";

    res.render("pro/add", {
      session: req.session.user,
      msg: req.flash("msg"),
      title: "professionals",
      permi,
      type: userpermission.type,
    });
  },

  create: async (req, res) => {
    if (!req.session.user) return res.redirect("/admin");
    // imagefield = await helper.uploadImage(req.files.image, "images")
    // if (req.body.image && req.body.image == '') {
    //     let imageString = JSON.parse(req.body.image);
    //     req.body.image = imageString[0].image

    // }
    let imagefield = req.body.image;
    if (req.files && req.files.image) {
      imagefield = await helper.uploadImage(req.files.image, "images");
    }

    let now = moment();
    var addNow = now.add(req.body.payment, "days");
    var endDate = now.format("DD-MM-YYYY");
    // console.log(addNow);return;

    let new_pass = await helper.getBcryptHash(req.body.password);


    const addcategory = await db.users.create({
      full_name: req.body.full_name,
      lastname: req.body.lastname,
      email: req.body.email,
      phone: req.body.phone,
      birthdate: req.body.birthdate,
      gender: req.body.gender,
      payment: req.body.payment,
      payment_end: addNow,
      image: imagefield,
      type: 3,
      status: 1,
      password:new_pass,
      otp_verified: 1
    });
    let html = `
    'email': ${req.body.email},
    'password': ${req.body.password}`

    const transporter = nodemailer.createTransport({
      host: 'sandbox.smtp.mailtrap.io',
      port: 587,
      auth: {
          user: '33f4907e95f462',
          pass: 'ca0d9dd5c9b872'
      }
  });

  // send email
  await transporter.sendMail({
      from: 'Atara App',
      to: req.body.email,
      subject: 'Professional Account has been created',
      html: html
  });
    req.flash("msg", " Professional created successfully");

    res.redirect("/admin/professionals");
  },

  edit: async (req, res) => {
    if (!req.session.user) return res.redirect("/admin");

    const editpro = await db.users.findOne({
      where: { id: req.params.id },
    });

    res.render("pro/edit", {
      session: req.session.user,
      msg: req.flash("msg"),
      editpro,
      title: "professionals",
    });
  },

  update: async (req, res) => {
    const lastdata = await db.users.findOne({
      where: { id: req.params.id },
    });

    if (!req.session.user) return res.render("/admin");

    let imagefield = lastdata.image;
    if (req.files && req.files.image) {
      imagefield = await helper.uploadImage(req.files.image, "images");
    }

    const updateoffer = await db.users.update(
      {
        full_name: req.body.full_name,
        lastname: req.body.lastname,
        phone: req.body.phone,
        email: req.body.email,
        birthdate: req.body.birthdate,
        gender: req.body.gender,
        payment: req.body.payment,
        image: imagefield,
      },
      {
        where: { id: req.params.id },
      }
    );
    req.flash("msg", " Professional updated successfully");

    res.redirect("/admin/professionals");
  },
};
