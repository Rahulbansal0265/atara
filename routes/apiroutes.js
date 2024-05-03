var express = require('express');
var router = express.Router();
const apicontroller=require('../controllers/ApiController')
let middleware= require("../middlewares/Auth");
const authenticateHeader = require('../middlewares/checkHeaderKeys').authenticateHeader




router.get('/encryptionForSkPk',apicontroller.encryptionForSkPk)

/* Api Pro Route */
router.post('/request_access',authenticateHeader,apicontroller.requestAccess);
router.post('/login',authenticateHeader,apicontroller.Login);
router.post('/logout',authenticateHeader,middleware,apicontroller.Logout);
router.post('/forgot_password',authenticateHeader,apicontroller.forgot_password);
router.get('/reset_password/:token', apicontroller.resetpassword);
router.post('/reset_password/:token',apicontroller.reset_password);
router.post('/profession_list',authenticateHeader,middleware,apicontroller.professionList);
router.post('/profession_detail',authenticateHeader,middleware,apicontroller.professionDetails);
router.post('/book_profession',authenticateHeader,middleware,apicontroller.bookProfession);
router.get('/notification_list',authenticateHeader,middleware, apicontroller.notificationList);
router.get('/offer_list',authenticateHeader,middleware,apicontroller.offerList);
router.get('/profession_statistics',authenticateHeader,middleware,apicontroller.professionStatistics);
router.post('/pro_agenda_list',authenticateHeader,middleware,apicontroller.proAgendaList);




/* Api Infulencer Route*/
router.post('/signup',authenticateHeader,apicontroller.userSignup);
router.post('/infulencer/update_profile',authenticateHeader,middleware,apicontroller.infulencerUpdateProfile);
router.post('/infulencer/verifyotp',authenticateHeader,middleware,apicontroller.infulencerVerifyOtp);
router.post('/infulencer/resendOtp',authenticateHeader,apicontroller.infulencerResendOtp);
router.post('/infulencer/changepassword',authenticateHeader,middleware,apicontroller.infulencerChangePassword);
router.get('/termandcondition',authenticateHeader,apicontroller.termsandConditions);
router.get('/privacypolicy',authenticateHeader,apicontroller.privacyPolicy);
router.get('/aboutus',authenticateHeader,apicontroller.aboutUs);
router.post('/help',authenticateHeader,middleware,apicontroller.Help);
router.get('/getprofile',authenticateHeader,middleware,apicontroller.getProfile);
router.post('/notificationupdate',authenticateHeader,middleware,apicontroller.notificationStatus);
router.post('/changelanguage',authenticateHeader,middleware,apicontroller.changeLanguage);
// router.get('/categorylist',authenticateHeader,apicontroller.categoryList);
router.post('/accept_reject_influncer',authenticateHeader,middleware,apicontroller.acceptRejectInfluncer);
router.post('/influncer_list',authenticateHeader,middleware,apicontroller.influncerList);
router.post('/influncer_detail',authenticateHeader,middleware,apicontroller.influncerDetail);
router.post('/influncer_statistics',authenticateHeader,middleware,apicontroller.influncerStatistics);
router.post('/home_data',authenticateHeader,middleware,apicontroller.homeData);
router.post('/nearby_offers',authenticateHeader,middleware,apicontroller.nearbyOffers);
router.post('/offer_detail',authenticateHeader,middleware,apicontroller.offerDetail);
router.post('/search_home',authenticateHeader,middleware,apicontroller.searchHome);
router.post('/agenda_list',authenticateHeader,middleware,apicontroller.agendaList);
router.post('/see_more',authenticateHeader,middleware,apicontroller.seeMore);
router.post('/agenda_details',authenticateHeader,middleware,apicontroller.agendaDetails);































module.exports = router;
