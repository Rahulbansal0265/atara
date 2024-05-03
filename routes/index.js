var express = require("express");
var express = require("express");
var router = express.Router();
const dashboardController = require("../controllers/dashboardController");
const adminController = require("../controllers/adminController");
const usersController = require("../controllers/usersController");
const categoryController = require("../controllers/categoryController");
const cmsController = require("../controllers/cmsController");
const offerController = require("../controllers/offerController");
const proController = require("../controllers/proController");
const statisticsController = require("../controllers/statisticsController");
// const businessController = require("../controllers/businessController");
const businessController = require("../controllers/businessController");
const bookingController = require("../controllers/bookingController");
const subAdminController = require("../controllers/subAdminController");
const teamController = require("../controllers/teamController");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

// Controller of Dashboard
router.get("/admin/dashboard", dashboardController.dashboard);

// Controller of navbar and admin
// router.get("/", adminController.login);
router.get("/admin", adminController.login);
router.post("/login", adminController.Inlogin);
router.get("/logout", adminController.logout);

router.get("/recover_password", adminController.recover_password);
router.get("/myprofile", adminController.myprofile);
router.post("/updateprofile", adminController.updateprofile);
router.get("/changepassword", adminController.changepassword);
router.post("/updatepassword", adminController.updatepassword);
router.post("/forgot_password", adminController.forgot_password);

// controller of influencer module
router.get("/userslisting", usersController.userslisting);
router.post("/statusupdate", usersController.userstatus);
router.post("/userapproval", usersController.userapproval);
router.get("/viewuser/:id", usersController.viewuser);
router.post("/deleteuser", usersController.deleteuser);
router.get("/admin/influencer/statistics", usersController.statistics);
router.get(["/admin/influencers/influencer","/admin/influencers/influencer/:id"], usersController.addEdit);
router.post("/admin/inluencers/addEditPost", usersController.addEditPost);
router.post("/admin/influencers/delete", usersController.deleteInfluencerStatistics);
router.get("/admin/influencers/view/:id", usersController.view);



// controller of booking module
router.get("/admin/bookings", bookingController.listing);
router.post("/admin/bookings/changeStatus", bookingController.status);
router.post("/admin/bookings/changeStoryStatus", bookingController.storymade);
router.post("/admin/bookings/changesStatStatus", bookingController.statstatus);
router.get("/admin/bookings/viewbooking/:id", bookingController.view);
router.post("/admin/bookings/delete", bookingController.delete);
router.post("/admin/bookings/wasPresentInfluencer", bookingController.wasPresentInfluencer);

router.get("/admin/our_selection_week", bookingController.ourSelectionWeek);
router.post("/admin/save_selection_week", bookingController.saveSelectionWeek);

router.get("/admin/request_an_access", bookingController.requestAnAccess);




// controller of pro module
router.get("/admin/professionals", proController.listing);
router.get("/admin/professionals/addpro", proController.add);
router.post("/admin/professionals/changeStatus", proController.changeStatus);

router.get("/admin/professionals/view/:id", proController.view);
router.post("/admin/professionals/delete", usersController.deleteuser);
router.post("/createpro", proController.create);
router.get("/admin/professionals/edit/:id", proController.edit);
router.post("/updatepro/:id", proController.update);

//category module
router.get("/admin/categories", categoryController.listing);
router.get("/admin/categories/add", categoryController.add);
router.post("/createcategory", categoryController.create);
router.post("/admin/categories/delete", categoryController.delete);
router.get("/admin/categories/edit/:id", categoryController.edit);
router.post("/editcategorypost/:id", categoryController.updatecategory);
router.post("/admin/categories/changeStatus", categoryController.status);
router.get("/viewcategory/:id", categoryController.view);

//statistics module
router.get("/admin/statistics", statisticsController.listing);
router.get(["/admin/statistics/statistic","/admin/statistics/statistic/:id"], statisticsController.addEdit);
router.post("/admin/statistics/delete", statisticsController.delete);
router.post("/admin/statistics/changeStatus", statisticsController.status);
router.get("/admin/statistics/viewstatistics/:id", statisticsController.view);
router.get("/admin/statistics/view/:id", statisticsController.view);
router.post("/admin/statistics/addEditPost", statisticsController.addEditPost);
router.post("/admin/statistics/getBusinesses", statisticsController.getBusinesses);
router.post("/admin/statistics/getStatistics", statisticsController.getStatistics);



// business module
router.get("/admin/businesses", businessController.index);
router.get(["/admin/businesses/business", "/admin/businesses/business/:id"], businessController.add);
router.post("/businesses/addEditPost", businessController.addEditPost);
router.get("/admin/businesses/viewbusiness/:id", businessController.view);
router.post("/admin/businesses/deletebusiness", businessController.delete);
router.post("/admin/businesses/deleteImages", businessController.deleteImages);
router.post("/admin/businesses/updateStatus", businessController.status);





//offer module
router.get("/admin/offers", offerController.listing);
router.get("/admin/offers/add", offerController.add);
router.post("/createoffer", offerController.create);
router.get("/admin/offers/view/:id", offerController.view);
router.post("/admin/offers/delete", offerController.delete);
router.get("/admin/offers/edit/:id", offerController.edit);
router.post("/updateoffer/:id", offerController.updateoffer);
router.post("/updateoffersingle/:id", offerController.updatesingleoffer);
router.post("/admin/offers/changeStatus", offerController.offerstatusupdate);
router.delete("/deleteoffermultiple", offerController.deleteOffer);
router.get("/editoffermulti/:id", offerController.editOffer);
router.post("/updateoffermultiple/:id", offerController.updateofferMulti);
router.post("/updateofferstatusmultiple", offerController.statusupdate);

//subadmin module
router.get("/admin/sub_admins", subAdminController.listing);
router.get(["/admin/sub_admins/sub_Admin","/admin/sub_admins/sub_Admin/:id"], subAdminController.addEdit);
router.post("/admin/sub_admins/addEditPost",subAdminController.addEditPost)
router.post("/admin/sub_admins/delete", subAdminController.delete);
router.post("/admin/sub_admins/checkEmail", subAdminController.checkEmail);
router.get("/admin/sub_admins/permission/:id", subAdminController.permission);
router.post("/admin/sub_admins/addPostpermission", subAdminController.addPostpermission);
router.post("/admin/sub_admins/changeStatus", subAdminController.status);

// // subadmin login
// router.get("/subadminlogin", subAdminController.subadminlogin);
// router.post("/subadminpost", subAdminController.subadminpost);
// router.get("/subadminDashboard", subAdminController.dashboard);





// router.post("/admin/sub_admins/changesStatus", subAdminController.changesStatus);


// router.get("/logoutsubadmin", subAdminController.logoutsubadmin);
// router.get("/changepwdsubadmin", subAdminController.changepassword);
// router.post("/updatepasswordSubadmin", subAdminController.updatepassword);
// router.get("/subAdminprofile", subAdminController.myprofile);
// router.post("/updateprofilesubadmin", subAdminController.updateprofile);

//team module

router.get("/admin/teams", teamController.listing);
router.get("/admin/teams/viewteam/:id", teamController.view);

// Controller of CMS module
router.get("/termconditions", cmsController.terms);
router.post("/updateterms", cmsController.update);
router.get("/privacy", cmsController.policy);
router.post("/updateprivacy", cmsController.policy_update);
router.get("/aboutus", cmsController.about);
router.post("/updateabout", cmsController.update_about);

//chart route
router.post("/chartData", dashboardController.chartData);

module.exports = router;
