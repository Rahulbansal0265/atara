const db = require("../models");
const helper = require("../helpers/helper");
const bookings = db.bookings;
const users = db.users;
const businesses = db.businesses;

db.bookings.belongsTo(users, { foreignKey: "pro_id", as: "professional" });
db.bookings.belongsTo(users, { foreignKey: "influencer_id", as: "influencer" });
db.bookings.belongsTo(businesses, {
  foreignKey: "business_id",
  as: "business",
});

module.exports = {
  listing: async (req, res) => {
    try {
      if (!req.session.user) return res.redirect("/admin");

      const bookinglisting = await db.bookings.findAll({
        include: [
          {
            model: db.users,
            as: "professional",
            required: true,
          },
          {
            model: db.users,
            as: "influencer",
            required: true,
          },
          {
            model: db.businesses,
            as: "business",
            required: true,
          },
        ],
        order: [["id", "DESC"]],
      });

     
      res.render("booking/listing", {
        bookinglisting,
        session: req.session.user,
        msg: req.flash("msg"),
        title: "bookings",
      });
    } catch (error) {
      console.log("-----------------error is----------------------", error);
    }
  },

  delete: async (req, res) => {
    const result = await db.bookings.destroy({
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
    var result = await db.bookings.update(
      {
        status: req.body.value,
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

  storymade: async (req, res) => {
    var result = await db.bookings.update(
      {
        storymad: req.body.status,
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

  wasPresentInfluencer: async (req, res) => {
    var result = await db.bookings.update(
      {
        was_influencer_present: req.body.status,
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

  statstatus: async (req, res) => {
    var result = await db.bookings.update(
      {
        stat: req.body.status,
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
    if (!req.session.user) return res.redirect("/admin");

    const booking = await db.bookings.findOne({
      include: [
        {
          model: db.users,
          as: "professional",
          required: true,
        },
        {
          model: db.users,
          as: "influencer",
          required: true,
        },
        {
          model: db.businesses,
          as: "business",
          required: true,
        },
      ],
      order: [["id", "DESC"]],

      where: { id: req.params.id },
    });
    console.log("-------------------booking", booking);
    res.render("booking/view", {
      booking,
      session: req.session.user,
      msg: req.flash("msg"),
      title: "bookings",
    });
  },
  ourSelectionWeek: async (req, res) => {
    try {
      if (!req.session.user) return res.redirect("/admin");

      const offerlisting = await db.offers.findAll({
        where : {
          deleted_at : 0
        },
        order: [["id", "DESC"]],
      });
      let get_old_data = await db.our_selection_of_week.findAll({
        raw:true
      });
      var idArr = [];
      if(get_old_data.length > 0){
        for(let i in get_old_data){
          idArr.push(get_old_data[i].offer_id)
        }
      }
      var allOffer = [];
      if(get_old_data.length > 0){
        for(let i in get_old_data){
          allOffer.push(get_old_data[i].is_all)
        }
      }

      // console.log(allOffer,"?>?>?>")
     
      res.render("booking/our_selection_week", {
        offerlisting,
        idArr,
        allOffer,
        session: req.session.user,
        msg: req.flash("msg"),
        title: "our_selection_week",
      });
    } catch (error) {
      console.log("-----------------error is----------------------", error);
    }
  },
  saveSelectionWeek: async (req, res) => {
    try {
      if (!req.session.user) return res.redirect("/admin");

      let get_old_data = await db.our_selection_of_week.findAll({
        raw:true
      });
      if(get_old_data.length > 0){
        await db.our_selection_of_week.destroy(
          {
          where : {},
        truncate: true
        }
        );
      }
      if(req.body.is_all ==1){
        // await db.our_selection_of_week.create({
        //   is_all : 1,
        // });
        // res.redirect("/admin/our_selection_week");
        if (Array.isArray(req.body.offer_id)) {
          for(let i in req.body.offer_id){
            await db.our_selection_of_week.create({
              offer_id : req.body.offer_id[i],
              is_all : 1
            });
          }
          res.redirect("/admin/our_selection_week");
  
        }
      }else{

        if (Array.isArray(req.body.offer_id)) {
          for(let i in req.body.offer_id){
            await db.our_selection_of_week.create({
              offer_id : req.body.offer_id[i]
            });
          }
          res.redirect("/admin/our_selection_week");
  
        }else{
          await db.our_selection_of_week.create({
            offer_id : req.body.offer_id
          });
          res.redirect("/admin/our_selection_week");
        }
      }

      
    } catch (error) {
      console.log("-----------------error is----------------------", error);
    }
  },
  requestAnAccess: async (req, res) => {
    try {
      if (!req.session.user) return res.redirect("/admin");

      const req_access = await db.request_access.findAll({
        order: [["id", "DESC"]],
      });
      
      res.render("booking/req_access", {
        req_access,
        session: req.session.user,
        msg: req.flash("msg"),
        title: "request_an_access",
      });
    } catch (error) {
      console.log("-----------------error is----------------------", error);
    }
  },
};
