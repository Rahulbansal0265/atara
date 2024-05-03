const db = require('../models');
const users = db.users;
var path = require('path');
const Helper = require('../helpers/helper');
const jsonData = require('../jsonData');
const jwt = require('jsonwebtoken');
const { use } = require('../routes');
const bcrypt = require('bcrypt');
// const helper = require('../helper');
const axios = require('axios');
const uuid = require('uuid').v4;
var Sequelize = require('sequelize');
const nodemailer = require('nodemailer');
const Op = Sequelize.Op;
const constants = require('../config/constants')
var aes256 = require('aes256');
const { error } = require('console');
var validator = require('validator');
const moment= require('moment') ;
var FCM = require('fcm-node');
var apn = require('apn');
const cron = require("node-cron");


db.businesses.belongsTo(users, { foreignKey: 'pro_id' });
db.businesses.hasOne(db.offers, { foreignKey: 'business_id' });
db.bookings.belongsTo(users, { foreignKey: 'influencer_id' });
db.influencer_statistics.hasOne(db.location_statistics, { foreignKey: 'influencer_statistic_id' });
db.businesses.hasMany(db.offers, { foreignKey: 'business_id' });
db.businesses.hasMany(db.business_categories, { foreignKey: 'business_id' });
db.businesses.hasOne(db.business_images, { foreignKey: 'business_id' });
db.businesses.hasMany(db.business_day_times, { foreignKey: 'business_id' });
db.bookings.belongsTo(db.businesses,{foreignKey:"business_id"});
db.bookings.belongsTo(db.offers, { foreignKey: 'business_id' });
db.our_selection_of_week.belongsTo(db.offers,{foreignKey:'offer_id'});
db.notifications.belongsTo(db.users, { foreignKey: 'sender_id' });
db.notifications.belongsTo(db.businesses, { foreignKey: 'target_id'});

// secret_key_encryptedSkBuffer = sk_bfhZ6MbuY025yBroQxEvYPY1BxY8zorKBirH4GN/9RB0RMRtfrn4IuaapFUT
// publish_key_encryptedPkBuffer =pk_pr6XCfphiGlI3env5QQ9YYVG1ttOt1dI7Ep74i+4DiXGLbamuioNAdkxCTL+pg==


cron.schedule('*/5 * * * *', async () => {
    // cron.schedule('* * * * *', async () => {
    try {
        // console.log("i ma here in cron");
        const yesterday = moment().add(-1, 'days');
        // const yesterday_date = yesterday.format('YYYY-MM-DD');
        // console.log(yesterday_date);
        // return
        var curr_date = moment(new Date()).format("YYYY-MM-DD");
        let current_time = moment().format("hh:mm a");
        // console.log(current_time,"========current_time=========")
        // console.log(curr_date,"========curr_date=========")


        var get_agenda_list = await db.bookings.findAll({
            where: {
                    date : curr_date,
                    time : {
                        [Op.lt]: current_time,
                    },
                    booking_status: {
                        [Op.ne]: 1,
                    },
            }  ,  
            raw: true,
            nest: true 
        });
        // console.log(get_agenda_list,"==========get_agenda_list==========");
        // return

        if(get_agenda_list != null){

            for(let i in get_agenda_list){
                await db.bookings.update({
                    booking_status : 3,
                },{
                    where : {
                        id : get_agenda_list[i].id
                    }
                });
            }
        }


// console.log(get_yesterday_data);
           

    } catch (error) {
        throw error
    }
}),
module.exports = {

    encryptionForSkPk: async (req, res) => {
        try {

            const required = {
                secret_key: req.headers.secret_key,
                publish_key: req.headers.publish_key,

            };
            const non_required = {};

            let requestdata = await Helper.vaildObjectApi(required, non_required, res);
            // console.log(requestdata,'======requestdata===========');
            // return
            if ((requestdata.secret_key !== global.secret_key) && (requestdata.publish_key !== global.publish_key)) {
                return Helper.failed(res, 'Key not matched!')
            } else if (requestdata.secret_key !== global.secret_key) {
                return Helper.failed(res, 'secret_key Key not matched!')

            } else if (requestdata.publish_key !== global.publish_key) {
                return Helper.failed(res, 'publish_key Key not matched!')

            }

            let sk_data = global.secret_key;
            let pk_data = global.publish_key;



            //encrypt key
            let cipher = aes256.createCipher(global.encryption_key);


            //encrypt buffer
            let encryptedSkBuffer = cipher.encrypt(sk_data);
            let encryptedPkBuffer = cipher.encrypt(pk_data);



            //decrypt data
            let decryptedSkBuffer = cipher.decrypt(encryptedSkBuffer);
            encryptedSkBuffer = 'sk_' + encryptedSkBuffer
            // decryptedSkBuffer = decryptedSkBuffer.toString('utf8')
            let decryptedPkBuffer = cipher.decrypt(encryptedPkBuffer);
            encryptedPkBuffer = 'pk_' + encryptedPkBuffer
            // decryptedPkBuffer = decryptedPkBuffer.toString('utf8')


            return Helper.success(res, 'data', { encryptedSkBuffer, encryptedPkBuffer, decryptedSkBuffer, decryptedPkBuffer })

        } catch (err) {
            console.log(err, '------err--------');
            return Helper.error(res, err);

        }
    },
    requestAccess: async function (req, res) {
        try {
            const required = {
                email: req.body.email,
                company_name:req.body.company_name
            };
            const nonRequired = {
                phone_number:req.body.phone_number
            };
            var chk_mail = validator.isEmail(req.body.email);

            if(chk_mail == true){

                let requestdata = await Helper.vaildObjectApi(required, nonRequired, res);
                var data = ''
    
                if(req.body.phone_number){
                    data = `
                        'email': ${req.body.email},
                        'company_name': ${req.body.company_name},
                        'phone_number': ${req.body.phone_number}`
                }else{
                    data = `
                        'email': ${req.body.email},
                        'company_name': ${req.body.company_name}`
                }
                await db.request_access.create(req.body);
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
                    subject: 'Request Access',
                    html: data
                });
                let msg = 'Thank you for contacting us, We will reach you shortly.';
                forgot_user_password = {};
                jsonData.true_status(res, forgot_user_password, msg)
            }else{
                let msg = 'Incorrect Email Format';
                    return jsonData.false_status(res, msg)
            }
        

        } catch (err) {
            Helper.error(res, err);
        }
    },
    Login: async (req, res) => {
        try {
            const required = {
                email: req.body.email,
                password: req.body.password,
                // language_type:req.body.language_type,
                role: req.body.role,
            };
            const non_required = {
                device_type: req.body.device_type,
                device_token: req.body.device_token,
                language_type: req.body.language_type,
            };

            let requestdata = await Helper.vaildObjectApi(required, non_required, res);

            var compareemail = await db.users.findOne({
                where: {
                    email: requestdata.email,
                    type: requestdata.role
                },
                raw: true,
            });

            if (compareemail) {
                const isMatch = await bcrypt.compare(requestdata.password, compareemail.password)

                if (!isMatch) {
                    let msg = 'Incorrect Email or Password';
                    return jsonData.false_status(res, msg)
                }
                let updateDetail = await db.users.update({
                    device_token: requestdata.device_token,
                    device_type: requestdata.device_type,
                    language_type: requestdata.language_type ? requestdata.language_type : compareemail.language_type, // Update language_type in the database

                }, {
                    where: {
                        id: compareemail.id
                    }
                });
                // let time = Helper.unixTimestamp();
                let token = jwt.sign({
                    id: compareemail.id,
                    email: compareemail.email,
                    // login_time: time
                }, "atara123");

                await users.update({
                    token: token
                }, {
                    where: {
                        id: compareemail.id
                    }
                });
                let findUserDetail = await db.users.findOne({
                    where: {
                        id: compareemail.id,
                    },
                    raw: true,
                });
                console.log(findUserDetail, ">>>>>>>>>>>>>>>>>>>>findUserDetail>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")

                findUserDetail.token = token;

                // Set language code based on language_type
                if (findUserDetail.language_type == 1) {
                    findUserDetail.language_code = 'en';
                } else if (findUserDetail.language_type == 2) {
                    findUserDetail.language_code = 'ara ar';
                } else if (findUserDetail.language_type == 3) {
                    findUserDetail.language_code = 'fr';
                }

                console.log(findUserDetail, '====================final user detail');
                // return
                let msg = 'Login Successfully';
                jsonData.true_status(res, findUserDetail, msg)
            } else {
                let data = {}
                let msg = 'Incorrect Email or Password';
                jsonData.wrong_status(res, msg)
            }
        } catch (error) {
            console.log(error, "error is=====================");
            return Helper.error(res, error);

        }
    },
    Logout: async (req, res) => {
        try {
            const required = {};
            const non_required = {};
            let requestdata = await Helper.vaildObjectApi(required, non_required, res);
            const authorization = req.headers.authorization.replace("Bearer", "").trim();
            await users.update({
                device_type: 0,
                device_token: '',
                token: '',
            }, {
                where: {
                    id: req.user.id,
                }
            })
            let token = jwt.sign({
                id: req.user.id,
                email: req.user.email,
            }, "bridge123", { expiresIn: '1s' });
            let msg = 'Logout Successfully';
            jsonData.true_status(res, {}, msg)
        } catch (error) {
            console.log(error, '------------error----------')
            return Helper.error(res, error);

        }
    },
    forgot_password: async function (req, res) {
        try {
            const required = {
                email: req.body.email,
            };
            const nonRequired = {};
            let requestdata = await Helper.vaildObjectApi(required, nonRequired, res);
            let forgot_user_password = await Helper.pro_send_email(requestdata, req, res)

            let msg = 'Email has been sent to your registered email';
            forgot_user_password = {};
            jsonData.true_status(res, forgot_user_password, msg)

        } catch (err) {
            Helper.error(res, err);
        }
    },
    resetpassword: async (req, res) => {
        try {
            res.render('reset_password')
        } catch (error) {
            console.log(error, 'error-----------------------')
            return Helper.error(res, error);

        }
    },
    reset_password: async function (req, res) {
        try {
            console.log(req.params, '=====@ reset token')

            const findUser = await db.users.findOne({
                where: {
                    resetpassword_token: req.params.token
                }
            })

            console.log(findUser, '===========findUser==============')

            var new_data = req.body

            console.log(new_data, '===========findUser==============')

            let update_password = await Helper.getBcryptHash(new_data.password);

            await db.users.update({ password: update_password, resetpassword_token: "" }, {
                where: {
                    id: findUser.id
                }
            })

            res.render('success_page')


        } catch (err) {
            Helper.error(res, err);
        }
    },

    /* ================================Infulencer api===================================================   */

    userSignup: async function (req, res) {
        try {

            const required = {
                first_name: req.body.first_name,
                email: req.body.email,
                country_code: req.body.country_code,
                dob: req.body.dob,
                phone: req.body.phone,
                gender: req.body.gender,
                image: req.files && req.files.image,
                password: req.body.password,
                instagram_link: req.body.instagram_link,
                tiktok_link: req.body.tiktok_link,
            };
            const non_required = {
                last_name: req.body.last_name,
                device_type: req.body.device_type,
                device_token: req.body.device_token,

            };
            let requestdata = await Helper.vaildObjectApi(required, non_required, res);

            const find_exist_user = await users.count({
                where: {
                    email: requestdata.email
                }
            });
            if (find_exist_user > 0) {
                return jsonData.false_status(res, "This email already exists.")
            }
            const find_exist_phone = await users.count({
                where: {
                    phone: requestdata.phone
                }
            });
            if (find_exist_phone > 0) {
                return jsonData.false_status(res, "This phone number already exists.")
            }
            requestdata.image = await Helper.files_upload(requestdata.image, "users")
            requestdata.password = await Helper.getBcryptHash(requestdata.password);
            let createuser = await users.create({
                full_name: requestdata.first_name,
                lastname: requestdata.last_name,
                email: requestdata.email,
                phone: requestdata.phone,
                gender: requestdata.gender, //1=male 2=female
                country_code: requestdata.country_code,
                password: requestdata.password,
                image: requestdata.image,
                country_code: requestdata.country_code,
                birthdate: requestdata.dob,
                insta_id: requestdata.instagram_link,
                tiktok_id: requestdata.tiktok_link,
                type: 2,
                device_type: req.body.device_type,
                device_token: req.body.device_token,

                language_type: req.body?.language_type

            });

            if (createuser) {

                let generate_otp = Math.floor(1000 + Math.random() * 9000);
                createuser.otp = 1111

                await users.update({ otp: 1111 }, { where: { email: createuser.email } })
                await Helper.send_emails(1111, createuser.email, "")

            }
            console.log(createuser, '---------------------otp');
            // return

            // let time = Helper.unixTimestamp();
            let token = jwt.sign({
                id: createuser.id,
                email: createuser.email,
                // login_time: time

            }, "bridge123");



            await users.update({
                token: token
            }, {
                where: {
                    id: createuser.id
                }
            });
            createuser.token = token;
            let msg = 'Sign Up Successfully';
            jsonData.true_status(res, createuser, msg)
        } catch (error) {
            console.log(error, '----------error----');
            return Helper.error(res, error);
        }
    },
    infulencerUpdateProfile: async function (req, res) {
        try {
            const required = {};
            const non_required = {
                image: req.files && req.files.image,
                first_name: req.body.first_name,
                // last_name: req.body.last_name,
                email: req.body.email,
                phone: req.body.phone,
                country_code: req.body.country_code,
                gender: req.body.gender,
                dob: req.body.dob,
                instagram_link: req.body.instagram_link,
                tiktok_link: req.body.tiktok_link,
            };

            let requestdata = await Helper.vaildObjectApi(required, non_required, res);


            if (requestdata.image) {
                requestdata.image = await Helper.files_upload(requestdata.image, "users")
            }

            const data = await users.update({
                image: requestdata.image,
                full_name: requestdata.first_name,
                lastname: requestdata.last_name,
                email: requestdata.email,
                phone: requestdata.phone,
                country_code: requestdata.country_code,
                gender: requestdata.gender,
                birthdate: requestdata.dob,
                insta_id: requestdata.instagram_link,
                tiktok_id: requestdata.tiktok_link,
            },
                {
                    where: {
                        id: req.user.id,
                    }

                });

            var userDetail = await users.findOne({
                attributes: [`id`, `type`, `full_name`, `lastname`, `age`, `bio`, `image`, `email`, `country_code`, `phone`, `notificationStatus`, `login_time`, `birthdate`, `website_url`, `status`, `is_approved`, `gender`, `otp`, `otp_verified`, `password`, `device_type`, `device_token`, `socialId`, `socialType`, `stripe_id`, `is_accept`, `insta_id`, `tiktok_id`,
                    `payment`, `payment_end`, `createdAt`, `updatedAt`, `permission`, `subadmin_id`, `token`, `language_type`
                ],
                where: {
                    id: req.user.id,
                }
            });

            let msg = ' User Profile Update Successfully';
            jsonData.true_status(res, userDetail, msg)

        } catch (error) {
            console.log(error, '-----------error---------------')
            return Helper.error(res, error);

        }

    },
    infulencerVerifyOtp: async function (req, res) {
        try {
            const required = {
                otp: req.body.otp,
            };
            const non_required = {};

            let requestdata = await Helper.vaildObjectApi(required, non_required, res);
            const userdata = await users.findOne({ where: { id: req.user.id } })

            if (requestdata.otp == userdata.otp) {
                const update_details = await users.update({
                    otp_verified: 1
                },
                    {
                        where: {
                            id: userdata.id
                        }
                    }
                );
            }
            get_user = await users.findOne({
                where: {
                    id: userdata.id
                }
            })
            if (requestdata.otp == userdata.otp) {
                let msg = ' User registered successfully ';
                jsonData.true_status(res, get_user, msg)
            } else {
                let msg = 'Wrong OTP';
                jsonData.wrong_status(res, msg)
            }

        } catch (error) {
            return Helper.error(res, error);
        }
    },
    infulencerResendOtp: async function (req, res) {
        try {
            const required = {
                email: req.body.email
            };
            const non_required = {};
            let requestdata = await Helper.vaildObjectApi(required, non_required, res);
            const userdata = await Helper.findUser(requestdata.email)
            console.log(userdata, '======userdata')
            if (userdata == null) throw "invalid email"


            // generate_otp = Math.floor(1000 + Math.random() * 9000);
            generate_otp = 1111;

            const update_details = await users.update({
                otp: generate_otp,
            },
                {
                    where: {
                        id: userdata.id
                    }
                }
            );
            sendotp = await Helper.send_emails(generate_otp, requestdata.email, "")
            jsonData.true_status(res, {}, "OTP resend successfully")

        } catch (error) {
            return Helper.error(res, error);


        }
    },
    infulencerChangePassword: async (req, res) => {
        console.log(req.body, '------------here-------');
        try {
            const required = {

                oldpassword: req.body.oldpassword,
                newpassword: req.body.newpassword,
                confirmpassword: req.body.confirmpassword,
            };
            const non_required = {};

            let requestdata = await Helper.vaildObjectApi(required, non_required, res);
            const check = await users.findOne({
                where: {
                    id: req.user.id,
                    // type: 2
                }
            })

            const matchdata = await bcrypt.compare(requestdata.oldpassword, check.password)

            if (matchdata == false) {
                let msg = 'Old password is incorrect';
                jsonData.wrong_status(res, msg)
            }
            else {
                if (requestdata.newpassword == requestdata.confirmpassword == false) {
                    let msg = 'Please Enter correct both password';
                    jsonData.wrong_status(res, msg)
                } else {
                    const newhashpassword = await bcrypt.hash(requestdata.newpassword, 10);
                    var data = await users.update({

                        password: newhashpassword
                    }, {
                        where: {
                            id: req.user.id
                        }
                    });
                    let msg = 'Password change  successfully.';
                    jsonData.true_status(res, {}, msg)
                }
            }
        } catch (error) {
            console.log(">>>>>>>>>>>", error)
            return Helper.error(res, error);

        }
    },
    termsandConditions: async (req, res) => {
        try {
            const required = {};
            const non_required = {};
            let requestdata = await Helper.vaildObjectApi(required, non_required, res);
            const termsandconditions = await db.cms.findOne({
                where:
                {
                    id: 1
                }
            })
            let msg = 'terms and condition get successfully';
            jsonData.true_status(res, termsandconditions, msg)

        } catch (error) {
            console.log(error, "error is=====================");
            return Helper.error(res, error);


        }
    },
    privacyPolicy: async (req, res) => {
        try {
            const required = {};
            const non_required = {};
            let requestdata = await Helper.vaildObjectApi(required, non_required, res);
            const privacypolicy = await db.cms.findOne({
                where:
                {
                    id: 2
                }
            })
            let msg = 'privacy and policy get successfully';
            jsonData.true_status(res, privacypolicy, msg)

        } catch (error) {
            console.log(error, "error is=========================");
            return Helper.error(res, error);

        }
    },
    aboutUs: async (req, res) => {
        try {
            const required = {};
            const non_required = {};
            let requestdata = await Helper.vaildObjectApi(required, non_required, res);
            const aboutUs = await db.cms.findOne({
                where:
                {
                    id: 3
                }
            })
            let msg = 'about us get successfully';
            jsonData.true_status(res, aboutUs, msg)

        } catch (error) {
            console.log(error, "error is=====================");
            return Helper.error(res, error);


        }
    },
    Help: async (req, res) => {
        try {
            const required = {
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                country_code: req.body.country_code,
                subject: req.body.subject,
                description: req.body.description,

            };
            const non_required = {};
            let requestdata = await Helper.vaildObjectApi(required, non_required, res);
            const help = await db.help.create({
                user_id: req.user.id,
                name: requestdata.name,
                email: requestdata.email,
                phone: requestdata.phone,
                country_code: requestdata.country_code,
                subject: requestdata.subject,
                description: requestdata.description,
            })
            let msg = 'Your message is sent successfully';
            jsonData.true_status(res, help, msg)

        } catch (error) {
            console.log(error, "error is=====================");
            return Helper.error(res, error);


        }
    },
    getProfile: async (req, res) => {
        try {
            const required = {};
            const non_required = {};
            let requestdata = await Helper.vaildObjectApi(required, non_required, res);
            const UserDetail = await users.findOne({
                where: {
                    id: req.user.id,
                },
            });
            let msg = 'profile get successfully';
            jsonData.true_status(res, UserDetail, msg)


        } catch (error) {
            console.log(error, "error is=====================");
            return Helper.error(res, error);

        }
    },
    notificationStatus: async (req, res) => {
        try {
            const required = {
                notification_status: req.body.notification_status //0=off  1=on
            };
            const non_required = {};
            let requestdata = await Helper.vaildObjectApi(required, non_required, res);

            await db.users.update({
                notificationStatus: requestdata.notification_status
            }, {
                where: {
                    id: req.user.id
                }
            })
            let msg = 'notification status  update successfully';
            jsonData.true_status(res, {}, msg)

        } catch (error) {
            console.log(error, "error is=========================");
            return Helper.error(res, error);
        }


    },
    changeLanguage: async (req, res) => {
        try {
            const required = {
                language_type: req.body.language_type // 1=english, 2=arbric, 3=french
            };
            const non_required = {};
            let requestdata = await Helper.vaildObjectApi(required, non_required, res);

            await db.users.update({
                language_type: requestdata.language_type
            }, {
                where: {
                    id: req.user.id
                }
            })
            let msg = 'language update successfully';
            jsonData.true_status(res, {}, msg)

        } catch (error) {
            console.log(error, "error is=========================");
            return Helper.error(res, error);
        }


    },
    // categoryList: async (req, res) => {
    //     try {
    //         const categoryList = await db.categories.findAll({});

    //         let msg = ' successfully get categories';
    //         jsonData.true_status(res, categoryList, msg)

    //     } catch (error) {
    //         return Helper.error(res, error);

    //     }
    // },
    professionList: async (req, res) => {
        try {
            const required = {
                category_id: req.body.category_id,
                offset: req.body.offset,
                limit: req.body.limit
            };
            const non_required = {};
            let requestdata = await Helper.vaildObjectApi(required, non_required, res);

            const offsetPage = parseInt(requestdata.offset) || 0; // Starting index of categories
            const limitPage = parseInt(requestdata.limit) || 10; // Maximum number of categories to retrieve
            const get_pro_list = await db.businesses.findAll({
                include: [
                    {
                        model: db.business_categories,
                        where: {
                            category_id: req.body.category_id,
                        },
                        required: true,
                    },
                    {
                        model: db.business_images
                    }
                ],
                offset: offsetPage * limitPage,
                limit: limitPage,
                order: [
                    ['id', 'DESC']
                ]
            });
            const total_record = await db.businesses.findAll({
                attributes: ['id'],
                include: [
                    {
                        model: db.business_categories,
                        where: {
                            category_id: req.body.category_id,
                        },
                        required: true,
                    }
                ],
            });
            let data = {
                total_records: total_record.length > 0 ? total_record.length : 0,
                list: get_pro_list ? get_pro_list : []
            }
            let msg = 'Get All Prolist successfully.';
            jsonData.true_status(res, data, msg)

        } catch (error) {
            console.log(error);
            return Helper.error(res, error);
        }
    },
    professionDetails: async (req, res) => {
        try {
            const required = {
                profession_id: req.body.profession_id,
            };
            const non_required = {};
            let requestdata = await Helper.vaildObjectApi(required, non_required, res);

            const chk_pro_id = await db.businesses.findOne({
                attributes: ['id'],
                where: {
                    pro_id: req.body.profession_id,
                },
            });
            if (chk_pro_id) {

                const get_pro_details = await db.businesses.findOne({
                    include: [
                        {
                            attributes: ['id', 'business_id', 'image'],
                            model: db.business_images
                        },
                        {
                            attributes: ['id', 'full_name', 'lastname', 'email', 'insta_id', 'tiktok_id', 'phone',],
                            model: users
                        },
                        {
                            model: db.offers,
                            where : {
                                deleted_at : 0,
                            },
                            required : false
                        },
                        {
                            model: db.business_day_times
                        }
                    ],
                    where: {
                        pro_id: req.body.profession_id,
                    },
                });
                let msg = 'Get Profession Details successfully.';
                jsonData.true_status(res, get_pro_details, msg)
            } else {
                throw "Invalid Id!";
            }

        } catch (error) {
            console.log(error);
            return Helper.error(res, error);
        }
    },
    bookProfession: async (req, res) => {
        try {
            const required = {
                pro_id: req.body.profession_id,
                time: req.body.time,
                date: req.body.date,
                business_id: req.body.business_id,
            };
            const non_required = {
                message: req.body.comment,
                spec_date_format : req.body.spec_date_format
            };
            let requestdata = await Helper.vaildObjectApi(required, non_required, res);

            let chk_profession_id = await users.findOne({
                attributes: ['id'],
                where: {
                    id: req.body.profession_id
                }
            });

            if (chk_profession_id) {
                let save_pro_booking = await db.bookings.create({
                    pro_id: req.body.profession_id,
                    time: req.body.time,
                    date: req.body.date,
                    message: req.body.comment ? req.body.comment : '',
                    influencer_id: req.user.id,
                    business_id: req.body.business_id,
                    number_of_people:req.body.number_of_people,
                    spec_date_format : req.body.spec_date_format
                });
                
                let get_pro_booking = await db.bookings.findOne({
                    attributes: ['id', 'pro_id', 'influencer_id', 'business_id', 'message', 'time', 'date', 'number_of_people', 'booking_status','spec_date_format', 'createdAt', 'updatedAt'],
                    where: {
                        id: save_pro_booking.id
                    }
                });
                let get_user_data = await db.users.findOne({
                    where : {
                        id : get_pro_booking.pro_id
                    },
                    raw:true
                });

                let msg = 'Profession Booking created successfully.';
                let all_data = {
                    device_token : get_user_data.device_token,
                    noti_type : 2,
                    sender_id : req.user.id,
                    sender_name : req.user.full_name,
                    msg : msg,
                    spec_date_format : req.body.spec_date_format,
                    date: req.body.date,
               } 
               if(get_user_data.device_type == 1){
                   
                   await module.exports.sendFCMnotification(all_data);
               }else if(get_user_data.device_type == 2){

                await module.exports.sendAPNnotification(req,res,all_data,get_user_data);
               }

                await db.notifications.create({
                    sender_id : req.user.id,
                    reciever_id : req.body.profession_id,
                    target_id : req.body.business_id,
                    title : "Atara",
                    message : `${req.user.full_name} has sent a request.`,
                    data : get_pro_booking,
                    spec_date_format : req.body.spec_date_format,
                    date: req.body.date,
                });
               
                jsonData.true_status(res, get_pro_booking, msg)

            } else {
                let msg = 'Invalid Profession id!.';
                return Helper.error(res, {},);
            }

        } catch (error) {
            console.log("...................",error);
            return Helper.error(res, error);
        }
    },
    acceptRejectInfluncer: async (req, res) => {
        try {
            const required = {
                booking_id: req.body.booking_id,
                booking_status: req.body.booking_status,
            };
            const non_required = {
            };
            let requestdata = await Helper.vaildObjectApi(required, non_required, res);

            let chk_booking_id = await db.bookings.findOne({
                // attributes: ['id'],
                where: {
                    id: req.body.booking_id
                }
            });

            if (chk_booking_id) {
                if (!['1', '2'].includes(req.body.booking_status)) {
                    throw "Booking status must be 1 or 2";
                }
                let update_booking_status = await db.bookings.update({
                    booking_status: req.body.booking_status,
                }, {
                    where: { id: req.body.booking_id }
                });
                let get_pro_booking = await db.bookings.findOne({
                    attributes: ['id', 'booking_status','influencer_id'],
                    where: {
                        id: req.body.booking_id
                    }
                });
                var msg = "Request Accepted Successfully."
                if (req.body.booking_status == 2) {
                    msg = "Request Rejected Successfully."
                }
                let resturant_name = await db.businesses.findOne({
                    where : {
                        pro_id : req.user.id
                    },
                    raw:true
                });
                let get_user_data = await db.users.findOne({
                    where : {
                        id : get_pro_booking.influencer_id
                    },
                    raw:true
                });
                let all_data = {
                    device_token : get_user_data.device_token,
                    noti_type : 3,
                    sender_id : req.user.id,
                    sender_name : req.user.full_name,
                    msg : msg
               }
               if(get_user_data.device_type == 1){
                   
                    await module.exports.sendFCMnotification(all_data);
                }else if(get_user_data.device_type == 2){

                    await module.exports.sendAPNnotification(req,res,all_data,get_user_data);
                }


                if(resturant_name){

                    await db.notifications.create({
                        sender_id : req.user.id,
                        reciever_id : chk_booking_id.influencer_id,
                        target_id : chk_booking_id.business_id,
                        title : "Atara",
                        message : msg,//`You have sent a request to ${resturant_name.name}`,
                        data : chk_booking_id
                    });
                    jsonData.true_status(res, get_pro_booking, msg);
                }else{
                    throw "Invalid Pro id!.";
                }

            } else {
                throw "Invalid id!.";
            }

        } catch (error) {
            console.log(error);
            return Helper.error(res, error);
        }
    },
    influncerList: async (req, res) => {
        try {
            const required = {
                date: req.body.date,
                offset: req.body.offset,
                limit: req.body.limit
            };
            const non_required = {
            };
            let requestdata = await Helper.vaildObjectApi(required, non_required, res);
            const offsetPage = parseInt(requestdata.offset) || 0; // Starting index of categories
            const limitPage = parseInt(requestdata.limit) || 10; // Maximum number of categories to retrieve

            let chk_booking_id = await db.bookings.findAll({
                include: [
                    {
                        attributes: ['id', 'full_name', 'lastname', 'email', 'insta_id', 'tiktok_id', 'phone', 'image'],
                        model: users
                    }
                ],
                attributes: ['id', 'pro_id', 'influencer_id', 'business_id', 'message', 'time', 'date', 'number_of_people', 'booking_status', 'createdAt', 'updatedAt'],
                where: {
                    pro_id: req.user.id,
                    date: req.body.date,
                    booking_status: 0
                },
                offset: offsetPage * limitPage,
                limit: limitPage,
                order: [
                    ['id', 'DESC']
                ]
            });
            let total_record = await db.bookings.findAll({
                include: [
                    {
                        attributes: ['id'],
                        model: users
                    }
                ],
                attributes: ['id'],
                where: {
                    pro_id: req.user.id,
                    date: req.body.date,
                    booking_status: 0
                },
            });
            let data = {
                total_records: total_record.length > 0 ? total_record.length : 0,
                list: chk_booking_id ? chk_booking_id : []
            }
            var msg = "Influncer list fetch Successfully."
            jsonData.true_status(res, data, msg);


        } catch (error) {
            console.log(error);
            return Helper.error(res, error);
        }
    },
    influncerDetail: async (req, res) => {
        try {
            const required = {
                booking_id: req.body.booking_id,
            };
            // console.log(req.body,'HHHHHHHHHHHHHHHHHHHHHHH');return
            const non_required = {
            };
            let requestdata = await Helper.vaildObjectApi(required, non_required, res);
            let chk_booking_id = await db.bookings.findOne({
                include: [
                    {
                        attributes: ['id', 'full_name', 'lastname', 'email', 'insta_id', 'tiktok_id', 'phone', 'image'],
                        model: users
                    }
                ],
                attributes: ['id', 'pro_id', 'influencer_id', 'business_id', 'message', 'time', 'date', 'number_of_people', 'booking_status', 'createdAt', 'updatedAt'],
                where: {
                    id: req.body.booking_id
                }
            });
            var msg = "Influncer Details fetch Successfully."
            jsonData.true_status(res, chk_booking_id?chk_booking_id:{}, msg);

        } catch (error) {
            console.log(error);
            return Helper.error(res, error);
        }
    },
    notificationList: async (req, res) => {
        try {

            let get_all_notification = await db.notifications.findAll({
                include:[
                    {
                        model : db.users,
                    },
                    {
                        attributes:['id','pro_id'],
                        model : db.businesses,
                        include : [
                            {model:db.business_images}
                        ]
                    },
                ],
                where: {
                    reciever_id: req.user.id
                },
                order: [
                    ['id', 'DESC']
                ]
            });
            var msg = "Notification List fetch Successfully."
            jsonData.true_status(res, get_all_notification, msg);

        } catch (error) {
            console.log(error);
            return Helper.error(res, error);
        }
    },
    influncerStatistics: async (req, res) => {
        try {
            const required = {
                influencer_id: req.body.influencer_id,
            };
            const non_required = {
            };
            let requestdata = await Helper.vaildObjectApi(required, non_required, res);

            let get_influncer_statics = await db.influencer_statistics.findOne({
                include: [
                    {
                        model: db.location_statistics,
                        required: false,
                    }
                ],
                where: {
                    influencer_id: req.body.influencer_id
                },
            });

            if (get_influncer_statics) {

                var msg = "Influncer Statistics fetch Successfully."
                jsonData.true_status(res, get_influncer_statics, msg);
            } else {
                let data = {

                    id: 0,
                    influencer_id: 0,
                    less_than_eighteen: 0,
                    eighteen_to_twentyFour: 0,
                    twentyFive_to_thirtyFour: 0,
                    thirtyFive_to_fourtyFour: 0,
                    moreThan_fourtyFour: 0,
                    male: 0,
                    female: 0,
                    view_avg: 0,
                    createdAt: 0,
                    updatedAt: 0,
                    location_statistic: null
                }
                var msg = "Influncer Statistics fetch Successfully."
                jsonData.true_status(res, data, msg);
            }

        } catch (error) {
            console.log(error);
            return Helper.error(res, error);
        }
    },
    offerList: async (req, res) => {
        try {
            let get_my_offer = await db.businesses.findAll({
                include: [
                    {
                        model: db.offers,
                        required: true,
                        where : {
                            deleted_at : 0,
                        }
                    }
                ],
                where: {
                    pro_id: req.user.id
                },
            });
            var msg = "Get My Offers fetch Successfully."
            jsonData.true_status(res, get_my_offer, msg);


        } catch (error) {
            console.log(error);
            return Helper.error(res, error);
        }
    },
    professionStatistics: async (req, res) => {
        try {
            let get_my_offer = await db.statistics.findOne({
                // include : [
                //     {
                //         model:db.offers
                //     }
                // ],
                where: {
                    pro_id: req.user.id
                },
            });
            if (get_my_offer) {
                var msg = "Get Profession Statistics Successfully."
                jsonData.true_status(res, get_my_offer, msg);

            } else {
                let data = {
                    id: 0,
                    pro_id: 0,
                    business_id: 0,
                    no_stories: 0,
                    no_views: 0,
                    no_guest: null,
                    money: 0,
                    partnership: 0,
                    influencer: 0,
                    statistics_of_the_month: 0,
                    campaign_performed: 0,
                    number_of_interactions: 0,
                    best_influencer: 0,
                    status: 0,
                    createdAt: 0,
                    updatedAt: 0
                }
                var msg = "Get Profession Statistics Successfully."
                jsonData.true_status(res, data, msg);
            }


        } catch (error) {
            console.log(error);
            return Helper.error(res, error);
        }
    },
    homeData: async (req, res) => {
        try {
            const required = {
                latittude: req.body.latittude,
                logitude: req.body.logitude,
            };
            const non_required = {
            };
            let requestdata = await Helper.vaildObjectApi(required, non_required, res);

            let get_category_arr = await db.categories.findAll({
                where : {
                    status : 1  
                },
            });

            const response = await axios.get(
                `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${req.body.latittude},${req.body.logitude}&radius=24140&type=tourist_attraction&key=${process.env.apiKey}`
            );

            var places = response.data.results;

            // Process and use the places data as required
            //   console.log(places,'Nearby famous places:');
            //   places.forEach((place, index) => {
            //     console.log(`${index + 1}. ${place.name}`);
            //   });

            var get_all_business = await db.businesses.findAll({
                raw:true,
                nest:true
            });
            var newArr=[]
            for(let i in get_all_business){

                var get_all_bookings = await db.bookings.findAll({
                    where : {
                        business_id : get_all_business[i].id
                    },
                    raw:true,
                    nest:true
                });
                if(get_all_bookings.length>20){
                    newArr.push(get_all_business[i])
                }
            }
            // console.log(newArr,"=============get_all_bookings============")
            // return

            // if(bookingIdsArr.length>20){
                for(let i in newArr){
                var get_restro_offers = await db.businesses.findAll({
                    where : {id:newArr[i].id},
                    include: [
                        {
                            model: db.offers,
                            required: false,
                            where : {
                                deleted_at : 0,
                            }
                        },
                        {
                            model: db.business_categories,
                            required: false,
                            // where: { category_id: 1 }
                        },
                        {
                            model: db.business_images
                        }
                    ],
                    order: [
                        ['id', 'DESC']
                    ]
                });
            }
    
            // }

            
            let get_latest_release = await db.businesses.findAll({
                include: [
                    {
                        model: db.business_images
                    }
                ],
                order: [
                    ['id', 'desc']
                ]
            });
            let selection_week = await db.our_selection_of_week.findAll({
                include: [
                    {
                        model: db.offers,
                        where : {
                            deleted_at : 0,
                        },
                        include : [
                            {
                                model : db.businesses,
                                include : [
                                    {
                                        model : db.business_images
                                    }
                                ]
                            },
                            
                        ]
                    }
                ],
                order : [
                    ['id','DESC']
                ]
            });

            let all_data = {
                all_category: get_category_arr ? get_category_arr : [],
                near_by_places: places ? places : [],
                our_best_bookings: get_restro_offers ? get_restro_offers : [],
                latest_release: get_latest_release ? get_latest_release : [],
                our_selection_of_the_week : selection_week ? selection_week : [],
               
            }
            var msg = "Home data fetch Successfully."
            jsonData.true_status(res, all_data, msg);
                                  
        } catch (error) {
            console.log(error);
            return Helper.error(res, error);
        }
    },
    nearbyOffers: async (req, res) => {
        try {
            const required = {
                latittude: req.body.latittude,
                logitude: req.body.logitude,
            };
            const non_required = {
            };
            let requestdata = await Helper.vaildObjectApi(required, non_required, res);

            var latittude = req.body.latittude;
            var longitude = req.body.logitude;

            var nearby_offers = await db.businesses.findAll({
                attributes: ['id',
                    'name',
                    "pro_id",
                    "location",
                    "latitude",
                    "longitude",
                    [
                        Sequelize.literal(
                            `6371 * acos(cos(radians(${latittude})) * cos(radians(latitude)) * cos(radians(${longitude}) - radians(longitude)) + sin(radians(${latittude})) * sin(radians(latitude)))`
                        ),
                        "distance",
                    ],
                ],
                include: [
                    {
                        attributes: ['id','category_id',
                        [Sequelize.literal('(SELECT category_icon FROM categories WHERE categories.id  = business_categories.category_id)'), 'CategoryIcon'],
                    ],
                        model : db.business_categories
                    },
                    {
                        // attributes: ['id', 'name', 'image',],
                        model: db.offers,
                        required: true,
                        where : {
                            deleted_at : 0,
                        }
                    },
                    {
                        // attributes: ['id', 'name', 'image',],
                        model: db.business_images,
                    }
                ],
            });


            var msg = "Get Near By Offers fetch Successfully."
            jsonData.true_status(res, nearby_offers, msg);


        } catch (error) {
            console.log(error);
            return Helper.error(res, error);
        }
    },
    offerDetail: async (req, res) => {
        try {
            const required = {
                offer_id: req.body.offer_id,
            };
            const non_required = {
            };
            let requestdata = await Helper.vaildObjectApi(required, non_required, res);

            var offer_detail = await db.businesses.findAll({
                include: [
                    {
                        // attributes: ['id', 'name', 'image',],
                        model: db.offers,
                        where : {
                            deleted_at : 0,
                        }
                    },
                    {
                        attributes: ['id', 'full_name', 'lastname', 'email', 'insta_id', 'tiktok_id', 'phone',],
                        model: users,
                    },
                ],
                where: { id: req.body.offer_id, }
            });


            var msg = "Get Offers Details Successfully."
            jsonData.true_status(res, offer_detail, msg);

        } catch (error) {
            console.log(error);
            return Helper.error(res, error);
        }
    },
    searchHome: async (req, res) => {
        try {
            const required = {
                keyword: req.body.keyword,
            };
            const non_required = {
            };
            let requestdata = await Helper.vaildObjectApi(required, non_required, res);

            var search_business = await db.businesses.findAll({
                include: [
                    {
                        model: db.business_categories,
                        required: false,
                    },
                    {
                        model: db.business_images
                    }
                ],
                where: {
                    name: {
                      [Op.like]: `%${req.body.keyword}%`,
                    },
                  },

            });
            // let search_offer = await db.offers.findAll({
            //     where: {
            //         title: {
            //           [Op.like]: `%${req.body.keyword}%`,
            //         },
            //       },

            // });
            // let nw_resons = {
            //     bussines : search_business,
            //     offer : search_offer
            // }

            var msg = "Search result fetch Successfully."
            jsonData.true_status(res, search_business, msg);

        } catch (error) {
            console.log(error);
            return Helper.error(res, error);
        }
    },
    agendaList: async (req, res) => {
        try {
            const required = {
                status: req.body.status,
            };
            const non_required = {
            };
            let requestdata = await Helper.vaildObjectApi(required, non_required, res);

            if(!['1','2'].includes(req.body.status))
            throw "status must be 1 or 2";

            var curr_date = moment(new Date()).format("YYYY-MM-DD");
            let current_time = moment().format("hh:mm a");

            if(req.body.status == 1){

                var get_agenda_list = await db.bookings.findAll({
                    include:[
                        {
                            attributes:['id','name'],
                            model : db.businesses,
                            include:[
                                {
                                    attributes:['id','image'],
                                    model : db.business_images
                                }
                            ]
                        },
                    ],
                    where: {
                        influencer_id: req.user.id,
                        [Op.and]:[{

                            date : {
                                [Op.gte]: curr_date,
                              },
                        },
                        {
                            time : {
                                [Op.gte]: current_time,
                              },
                        },
                        {
                            booking_status : {
                                [Op.ne]: 2,
                              }, 
                        },
                        {
                            booking_status : {
                                [Op.ne]: 3,
                              }, 
                        }
                    ],
                        // date : {
                        //     [Op.gte]: curr_date,
                        //   },
                        // //   time : {
                        // //     [Op.gt]: current_time,
                        // //   },
                        //   booking_status : {
                        //     [Op.ne]: 2,
                        //   },
                        //   booking_status: 1
                      },
                        order: [
                            ['id', 'DESC']
                        ]
                });
            }else{
                var get_agenda_list = await db.bookings.findAll({
                    include:[
                        {
                            attributes:['id','name'],
                            model : db.businesses,
                            include:[
                                {
                                    attributes:['id','image'],
                                    model : db.business_images
                                }
                            ]
                        },
                    ],
                    where: {
                        influencer_id: req.user.id,
                        [Op.and]:[{

                            date : {
                                [Op.lte]: curr_date,
                              },
                        },
                        {
                            time : {
                                [Op.lt]: current_time,
                              },
                        },
                        // {

                        //     booking_status: 2
                        // }
                    ],
                    [Op.or] : [
                        {
                            booking_status: 2
                        },
                        {
                            booking_status: 0
                        },
                        {
                            booking_status: 1
                        },
                        {
                            booking_status: 3
                        },
                    ]
                   
                        // date : {
                        //     [Op.lt]: curr_date,
                        //   },
                      },
                        order: [
                            ['id', 'DESC']
                        ]
                });
            }

            var msg = "Agenda Listing fetch Successfully."
            jsonData.true_status(res, get_agenda_list, msg);

        } catch (error) {
            console.log(error);
            return Helper.error(res, error);
        }
    },
    proAgendaList: async (req, res) => {
        try {
            const required = {
                status: req.body.status,
            };
            const non_required = {
            };
            let requestdata = await Helper.vaildObjectApi(required, non_required, res);

            if(!['1','2'].includes(req.body.status))
            throw "status must be 1 or 2";

            var curr_date = moment(new Date()).format("YYYY-MM-DD");
            let current_time = moment().format("hh:mm a");

            if(req.body.status == 1){

                var get_agenda_list = await db.bookings.findAll({
                    include:[
                        {
                            attributes:['id','name'],
                            model : db.businesses,
                            include:[
                                {
                                    attributes:['id','image'],
                                    model : db.business_images
                                }
                            ]
                        },
                        {
                            attributes:['id','full_name','lastname','image'],
                            model : users
                        }
                    ],
                    where: {
                        pro_id: req.user.id,
                        [Op.and]:[{

                            date : {
                                [Op.gte]: curr_date,
                              },
                            time : {
                                [Op.gte]: current_time,
                              },
                            booking_status : {
                                [Op.ne]: 2,
                              },
                            booking_status : {
                                [Op.ne]: 3,
                              },
                        // },{

                            // booking_status: 1
                        }]
                      },
                        order: [
                            ['id', 'DESC']
                        ]
                });
            }else{
                var get_agenda_list = await db.bookings.findAll({
                    include:[
                        {
                            attributes:['id','name'],
                            model : db.businesses,
                            include:[
                                {
                                    attributes:['id','image'],
                                    model : db.business_images
                                }
                            ]
                        },
                        {
                            attributes:['id','full_name','lastname','image'],
                            model : users
                        }
                    ],
                    where: {
                        pro_id: req.user.id,
                        [Op.and]:[{

                            date : {
                                [Op.lte]: curr_date,
                              },
                            time : {
                                [Op.lt]: current_time,
                              },
                        },
                        // {

                        //     booking_status: 2
                        // }
                    ],
                    [Op.or] : [
                        {
                            booking_status: 2
                        },
                        {
                            booking_status: 0
                        },
                        {
                            booking_status: 1
                        },
                        {
                            booking_status: 3
                        },
                    ]
                        // date : {
                        //     [Op.lt]: curr_date,
                        //   },
                        //   booking_status: 1
                      },
                        order: [
                            ['id', 'DESC']
                        ]
                });
            }

            var msg = "Pro Agenda Listing fetch Successfully."
            jsonData.true_status(res, get_agenda_list, msg);

        } catch (error) {
            console.log(error);
            return Helper.error(res, error);
        }
    },
    seeMore: async (req, res) => {
        try {
            const required = {
                category_id: req.body.category_id,
            };
            const non_required = {
            };
            let requestdata = await Helper.vaildObjectApi(required, non_required, res);

            if(req.body.category_id == 0){

                let get_latest_release = await db.businesses.findAll({
                    include: [
                        {
                            model: db.business_images
                        }
                    ],
                    order: [
                        ['id', 'desc']
                    ]
                });
                var msg = "See More Data fetch Successfully."
                jsonData.true_status(res, get_latest_release, msg);
            }else{

                let get_restro_offers = await db.businesses.findAll({
                    include: [
                        {
                            model: db.offers,
                            required: true,
                            where : {
                                deleted_at : 0,
                            }
                        },
                        {
                            model: db.business_categories,
                            required: true,
                            where: { category_id: req.body.category_id }
                        },
                        {
                            model: db.business_images
                        }
                    ],
                    order: [
                        ['id', 'DESC']
                    ]
                });
                var msg = "See More Data fetch Successfully."
                jsonData.true_status(res, get_restro_offers, msg);
            }
                      
        } catch (error) {
            console.log(error);
            return Helper.error(res, error);
        }
    },
    agendaDetails: async (req, res) => {
        try {
            const required = {
                booking_id: req.body.booking_id,
            };
            const non_required = {
            };
            let requestdata = await Helper.vaildObjectApi(required, non_required, res);

                var get_agenda_details = await db.bookings.findOne({
                    include:[
                        {
                            // attributes:['id','name'],
                            model : db.businesses,
                            include:[
                                {
                                    // attributes:['id','image'],
                                    model : db.business_images
                                }
                            ]
                        },
                        {
                            model : db.offers,
                            where : {
                                deleted_at : 0,
                            },
                            required : false
                        }
                    ],
                    where: {
                        id: req.body.booking_id,
                      },
                });

            var msg = "Agenda Details fetch Successfully."
            jsonData.true_status(res, get_agenda_details, msg);

        } catch (error) {
            console.log(error);
            return Helper.error(res, error);
        }
    },
    sendFCMnotification: async (all_data) => {
        if (all_data.device_token && all_data.device_token != '') {
          var new_message = {
              to:all_data.device_token,
              data: {
                  title: "Atara",
                  body: all_data.msg,
                  notification_type: all_data.noti_type,
                  sender_id: all_data.sender_id,
                  sender_name: all_data.sender_name,
                  spec_date_format : all_data.spec_date_format,
                  date: all_data.date,

              },
              notification: {
                title: "Atara",
                body: all_data.msg,
                notification_type: all_data.noti_type,
                sender_id: all_data.sender_id,
                sender_name: all_data.sender_name,
                spec_date_format : all_data.spec_date_format,
                date: all_data.date,
            }
          };

          var serverKey = process.env.fcm_server_key;
        //   console.log(serverKey,">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.serverKey");
        //   return
          var fcm = new FCM(serverKey);
          fcm.send(new_message, function (err, response) {
        //   console.log(new_message, "--------------------------here i am")
              if (err) {
                console.log(err,"Something has gone wrong")
                //   console.log(new_message, "new_message_err");
              } else {
                //   console.log(new_message,"newmesage_result");
                  console.log(response,"successfuly sent with response.");

              }
          });
        }
    },
    sendAPNnotification: async (req,res,all_data,get_user_data) => {
        // console.log(all_data,"===========all_data==============");
        
        if (get_user_data.device_token && get_user_data.device_token != '') {
            var options = {
                token: {
                  key:  __dirname+"/AuthKey_76AW9XYDLJ.p8",
                  keyId: "76AW9XYDLJ",
                  teamId: "UL6P4CWL4N"
                },
                production: false
              };
               
              var apnProvider = new apn.Provider(options);

              var note = new apn.Notification();

                note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
                note.badge = 1;
                note.sound = "ping.aiff";
                note.alert = `\uD83D\uDCE7 \u2709 ${req.user.name} has sent a request.`;
                note.payload = {'messageFrom': req.user.full_name,all_data};
                note.title =  "Atara";
                note.body = all_data.msg;
                note.notification_type = all_data.noti_type;
                note.sender_id = all_data.sender_id;
                note.sender_name =  all_data.sender_name;
                note.spec_date_format = req.body.spec_date_format;
                note.date = req.body.date;
                note.topic = "cqlsys.atara";

                apnProvider.send(note, get_user_data.device_token).then( (result) => {
                    console.log(note,"=======note======")
                    console.log(result,"====result=======")
                });
                
                
        }
    },









}