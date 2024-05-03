const db = require("../models");
const helper = require("../helpers/helper");
const offers = db.offers;
const businesses = db.businesses;
const business_images = db.business_images;
const offer_multiples = db.offer_multiples;
var nl2br = require("nl2br");
offers.belongsTo(businesses, { foreignKey: "business_id" });
// db.businesses.hasMany(business_images, { foreignKey: "business_id" });
// db.offers.hasMany(offer_multiples, { foreignKey: "offer_id" });
module.exports = {
  listing: async (req, res) => {
    try {
      if (!req.session.user) return res.redirect("/admin");
      const offersArr = await db.offers.findAll({
        include: [
          {
            model: db.businesses,
            required: true,
          },
        ],
        where : {
          deleted_at : 0,
        },
        order: [["id", "DESC"]],
      
      });
      res.render("offer/listing", {
        offersArr,
        session: req.session.user,
        msg: req.flash("msg"),
        title: "offers",
      });
    } catch (error) {
      console.log("-----------------error is----------------------", error);
    }
  },

  view: async (req, res) => {
    if (!req.session.user) return res.redirect("/admin");

    var offerObj = await db.offers.findOne({
      include: [
        {
          model: businesses,
          include: [
            {
              model: db.business_images,
            },
          ],
        },
      ],
      where: { id: req.params.id },
      raw: true,
      nest: true,
    });
    if (offerObj) {
      var offerMultiplesArr = await db.offer_multiples.findAll({
        where: { offer_id: offerObj.id },
        raw: true,
        nest: true,
      });
      let bussinessDayTimesArr = await db.business_day_times.findAll({
        where: { business_id: offerObj.business_id },
        raw: true,
        nest: true,
      });

      if (bussinessDayTimesArr.length > 0) {
        offerObj.bussinessDayTimesArr = bussinessDayTimesArr;
      } else {
        offerObj.bussinessDayTimesArr = [];
      }

      if (offerMultiplesArr.length > 0) {
        offerObj.offerMultiplesArr = offerMultiplesArr;
      } else {
        offerObj.offerMultiplesArr = [];
      }
    }

    if (offerObj.offerMultiplesArr.length > 0) {
      for (let i in offerObj.offerMultiplesArr) {
        offerObj.offerMultiplesArr[i].offer_condition = nl2br(
          offerObj.offerMultiplesArr[i].offer_condition
        );
      }
    }
    // console.log(offerObj,">>>>>>>>>>>>>>>");
    // return
    res.render("offer/viewoffer", {
      offerObj,
      session: req.session.user,
      msg: req.flash("msg"),
      title: "offers",
    });
  },

  delete: async (req, res) => {
    const result = await db.offers.destroy({
      where: {
        id: req.body.id,
      },
    });
    if (result) {
      return res.json(1);
    }
    return res.json(0);
  },

  offerstatusupdate: async (req, res) => {
    var result = await db.offers.update(
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

    const businesses = await db.businesses.findAll({
      where: {
        status: 1,
      },
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
        return e.Offer;
      });

    let permi = permision ? permision[0]?.Offer : "";

    res.render("offer/add", {
      businesses,
      permi,
      type: user.type,
      session: req.session.user,
      msg: req.flash("msg"),
      title: "offers",
    });
  },

  create: async (req, res) => {
    if (!req.session.user) return res.redirect("/admin");

    let get_old_offer = await db.offers.update({
        deleted_at : 1,
      },{
      where : {
        deleted_at : 0,
        business_id: req.body.business_id
      },
      raw:true
    });

    imagefield = await helper.uploadImage(req.files.image, "images");
    const save_offer = await db.offers.create({
      business_id: req.body.business_id,
      title: req.body.title,
      status: 1,
      offer_condition : req.body.offer_condition,
      offer: req.body.offer,
      brief: req.body.brief,
      image: imagefield,
    });

    // const count = await db.offers.count({
    //   where: {
    //     business_id: req.body.business_id,
    //   },
    // });
    // if (count > 0) {
    //   req.flash("msg", "Business already Exist");
    //   res.redirect("/addoffer");
    //   return;
    // }

    // const addcategory = await db.offers.create({
    //   business_id: req.body.business_id,
    //   // title: req.body.title,
    //   status: 1,
    // });

    // var title = Array.isArray(req.body.title)
    //   ? req.body.title
    //   : [req.body.title];

    // var brief = Array.isArray(req.body.brief)
    //   ? req.body.brief
    //   : [req.body.brief];

    // var offer_condition = Array.isArray(req.body.offer_condition)
    //   ? req.body.offer_condition
    //   : [req.body.offer_condition];

    // var offer = Array.isArray(req.body.offer)
    //   ? req.body.offer
    //   : [req.body.offer];

    // for (let i in title) {
    //   console.log(title[i], "aaaaaaaaaaaaaaaaaaaaaaaaaa");

    //   const noOfguestmultiple = await db.offer_multiples.create({
    //     offer_id: addcategory.id,
    //     title: title[i],
    //     brief: brief[i],

    //     offer_condition: offer_condition[i],
    //     offer: offer[i],
    //   });
    //   // category_id.push(catmultiple)
    // }
    req.flash("msg", " Offer created successfully");

    res.redirect("/admin/offers");
  },

  edit: async (req, res) => {
    if (!req.session.user) return res.redirect("/admin");

    const editofferrrr = await db.offers.findOne({
      // include: [
      //   {
      //     model: db.offer_multiples,
      //   },
      // ],

      where: { id: req.params.id },
      raw: true,
      nest: true,
    });

    const businesses = await db.businesses.findAll({
      where: { status: 1 },
    });

    if (editofferrrr) {
      var offerMultiplesArr = await db.offer_multiples.findAll({
        where: { offer_id: editofferrrr.id },
        raw: true,
        nest: true,
      });
    }
    if (offerMultiplesArr.length > 0) {
      for (let i in offerMultiplesArr) {
        offerMultiplesArr[i].offer_condition = nl2br(
          offerMultiplesArr[i].offer_condition
        );
      }
    }

    const data = editofferrrr.offer_multiples;

    res.render("offer/editoffer", {
      session: req.session.user,
      offerMultiplesArr,
      data,
      msg: req.flash("msg"),
      editofferrrr,
      businesses,
      title: "offers",
    });
  },

  updateoffer: async (req, res) => {
    const lastdata = await db.offers.findOne({
      where: { id: req.params.id },
    });

    if (!req.session.user) return res.render("/admin");
    let imagefield = lastdata.image;
    if (req.files && req.files.image) {
      imagefield = await helper.uploadImage(req.files.image, "images");
    }

    const updateoffer = await db.offers.update(
      {
        business_id: req.body.business_id,
      },
      {
        where: { id: req.params.id },
      }
    );

    if (req.body.title) {
      // await db.offer_multiples.destroy({
      //     where : {
      //         offer_id:req.params.id,
      //     }
      // })
      var title = Array.isArray(req.body.title)
        ? req.body.title
        : [req.body.title];

      var brief = Array.isArray(req.body.brief)
        ? req.body.brief
        : [req.body.brief];

      var offer_condition = Array.isArray(req.body.offer_condition)
        ? req.body.offer_condition
        : [req.body.offer_condition];

      var offer = Array.isArray(req.body.offer)
        ? req.body.offer
        : [req.body.offer];

      for (let i in title) {
        console.log(title[i], "aaaaaaaaaaaaaaaaaaaaaaaaaa");
        if (title[i] != "") {
          const catmultiple = await db.offer_multiples.create({
            offer_id: req.params.id,
            title: title[i],
            offer_condition: offer_condition[i],
            offer: offer[i],
            brief: brief[i],
          });
        }
      }
    }

    req.flash("msg", " Offer updated successfully");

    res.redirect("/admin/offers");
  },

  deleteOffer: async (req, res) => {
    const data = await db.offer_multiples.destroy({
      where: {
        id: req.body.id,
      },
    });

    res.send("1");
  },

  editOffer: async (req, res) => {
    if (!req.session.user) return res.redirect("/admin");

    const editofferrrr = await db.offer_multiples.findOne({
      where: { id: req.params.id },
    });

    res.render("offer/editoffer", {
      session: req.session.user,
      msg: req.flash("msg"),
      editofferrrr,
      title: "offers",
    });
  },

  updateofferMulti: async (req, res) => {
    const lastdata = await db.offer_multiples.findOne({
      where: { id: req.params.id },
    });

    const updateoffer = await db.offer_multiples.update(
      {
        title: req.body.title,

        offer_condition: req.body.offer_condition,
        offer: req.body.offer,
        brief: req.body.brief,
      },
      {
        where: { id: req.params.id },
      }
    );

    //    console.log(updateoffer,'updateofferupdateofferupdateoffer');
    req.flash("msg", " Offer updated successfully");

    res.redirect("/offerlisting");
  },
  updatesingleoffer: async (req, res) => {

    let get_old_data = await db.offers.findOne({
      raw:true,
      where : {
        id: req.params.id
      }
    });
    
    if(req.files && req.files.image != null){
      var imagefield = await helper.uploadImage(req.files.image, "images");
    }

    const updateoffer = await db.offers.update(
      {
        title: req.body.title ? req.body.title : get_old_data.title,
        offer_condition: req.body.offer_condition ? req.body.offer_condition : get_old_data.offer_condition,
        offer: req.body.offer ? req.body.offer : get_old_data.offer,
        brief: req.body.brief ? req.body.brief : get_old_data.brief,
        image: imagefield ? imagefield : get_old_data.image,
      },
      {
        where: { id: req.params.id },
      }
    );

    req.flash("msg", " Offer updated successfully");

    res.redirect("/admin/offers");
  },

  statusupdate: async (req, res) => {
    var check = await db.offer_multiples.update(
      {
        status: req.body.value,
      },
      {
        where: {
          id: req.body.id,
        },
      }
    );

    res.send(false);
  },
};
