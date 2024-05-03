
const e = require('express');
var path = require('path');
const db = require('../models')
const bcrypt = require('bcrypt')
const helper = require("../helpers/helper");
const { v4: uuidv4 } = require('uuid');



module.exports = {
        
  add: async function (req, res) {
    if (!req.session.user) return res.redirect("/login")
      res.render("subAdmin/add", { session: req.session.user, msg: req.flash('msg'),title:"addsubadmin" })
  },

   subadminlogin: async (req, res) => {


        res.render("subAdmin/login",{ msg: req.flash('msg')})

    },
    
}