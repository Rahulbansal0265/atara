const db = require("../models");
const helper = require("../helpers/helper");
const categories = db.categories;
const users = db.users;

module.exports = {
  listing: async (req, res) => {
    try {
      if (!req.session.user) return res.redirect("/admin");
      var categoriesArr = await db.categories.findAll({
        order: [["id", "DESC"]],
      });
      
      // console.log(global.permission)

      res.render("category/categorylisting", {
        categoriesArr,
        session: req.session.user,
        msg: req.flash("msg"),
        title: "categories",
      });
    } catch (error) {
      console.log("-----------------error is----------------------", error);
    }
  },

  delete: async (req, res) => {
    const result = await db.categories.destroy({
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
    var result = await db.categories.update(
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

    // try{
    //     var status = await db.categories.update({
    //         status: req.params.value,
    //     }, {
    //         where: {
    //             id: req.params.id,
    //         },
    //     });

    //     req.flash('msg', 'Status updated successfully');

    //     res.redirect("/categorylisting")

    //     // res.send(false)
    // } catch (err){
    //     console.log(err)
    // }
  },

  add: async (req, res) => {
    if (!req.session.user) return res.redirect("/admin");
    const users = await db.users.findAll({});

    const user = await db.users.findOne({
      where: {
        id: req.session.user.id,
      },
    });

    let permision =
      user &&
      user.type === 4 &&
      JSON.parse(user.permission).permission.filter(function (e) {
        return e.Categories;
      });

    let permi = permision ? permision[0]?.Categories : "";
    // console.log(permi, "oooooooooo");

    res.render("category/addcategory", {
      users,
      permi,
      type: user.type,
      session: req.session.user,
      msg: req.flash("msg"),
      title: "categories",
    });
  },

  create: async (req, res) => {
    if (!req.session.user) return res.redirect("/admin");
    imagefield = await helper.uploadImage(req.files.image, "images");
    cat_icon = await helper.uploadImage(req.files.category_icon, "images");
    const addcategory = await db.categories.create({
      name: req.body.name,
      image: imagefield,
      status: 1,
      category_icon : cat_icon,
    });
    req.flash("msg", " Category created successfully");

    res.redirect("/admin/categories");
  },

  edit: async (req, res) => {
    if (!req.session.user) return res.redirect("/admin");
    const users = await db.users.findAll({});

    const editcategory = await db.categories.findOne({
      where: { id: req.params.id },
    });
    console.log(
      users,
      "usersusersusersusersusersusersusers",
      editcategory,
      "editcategoryeditcategoryeditcategory"
    );
    res.render("category/editcategory", {
      users,
      session: req.session.user,
      msg: req.flash("msg"),
      editcategory,
      title: "categories",
    });
  },

  updatecategory: async (req, res) => {
    const lastdata = await db.categories.findOne({
      where: { id: req.params.id },
    });

    if (!req.session.user) return res.render("/admin");
    let imagefield = lastdata.image;
    if (req.files && req.files.image) {
      imagefield = await helper.uploadImage(req.files.image, "images");
    }

    const updatecategory = await db.categories.update(
      {
        name: req.body.name,
        image: imagefield,
      },
      {
        where: { id: req.params.id },
      }
    );
    req.flash("msg", " Category updated successfully");

    res.redirect("/admin/categories");

    // const lastdata=await db.categories.findOne({
    //     where:{id:req.params.id}
    // })

    // if(!req.session.user)return res.render("/login")
    // let imagefield = lastdata.image
    // if (req.files&&req.files.image){
    //  imagefield = await helper.uploadImage(req.files.image, "images")
    // }

    // const updatecategory=await db.categories.update({
    //     name:req.body.name,
    //     image:imagefield},
    //      {
    //     where:{id:req.params.id}
    // })
    // req.flash('msg', ' Category edited successfully')

    // res.redirect("/categorylisting")
  },

  view: async (req, res) => {
    let cats = await db.categories.findOne({
      attributes: {},
      where: { id: req.params.id },
    });
    cats = cats.toJSON();

    if (!req.session.user) return res.redirect("/admin");

    res.render("category/viewcategory", {
      cats,
      session: req.session.user,
      msg: req.flash("msg"),
      title: "categories",
    });
  },
};
