var db = require("../models");
const uuid = require("uuid").v4;
var path = require("path");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const FCM = require("fcm-node");
var apn = require("apn");
const fileExtension = require("file-extension");
const util = require("util");
const Thumbler = require("thumbler");
const fs = require("fs-extra");

var options = {
  token: {
    key: "./AuthKey_Q3NW9UXH2J.p8",
    keyId: "Q3NW9UXH2J",
    teamId: "4XVQBWH9QF",
  },
  production: false,
};
module.exports = {
  uploadImage: async (file, folder) => {
    if (file.name == "") return;

    console.log("-----------------", folder, file);

    var extension = path.extname(file.name);
    var fileImage = uuid() + extension;
    console.log(process.cwd() + `/public/${folder}/` + fileImage);
    file.mv(process.cwd() + `/public/${folder}/` + fileImage, function (err) {
      if (err) console.log(err);
    });
    // console.log("0000000000000000", fileImage);
    return fileImage;
  },

  thumbnail_upload: async function (get_image_data) {
    let thumbnail = get_image_data;
    //  console.log(image,"image")
    if (Array.isArray(thumbnail) === true) {
      temp_array = [];
      await Promise.all(
        thumbnail.map(async (c) => {
          var extension = path.extname(c.name);
          var filethumbnail = uuid() + extension;
          c.mv(
            process.cwd() + "/public/images/users/" + filethumbnail,
            function (err) {
              if (err) console.log(err);
            }
          );
          temp_array.push(filethumbnail);
        })
      );
      return temp_array;
    } else {
      var extension = path.extname(thumbnail.name);
      var filethumbnail = uuid() + extension;
      thumbnail.mv(
        process.cwd() + "/public/images/posts/" + filethumbnail,
        function (err) {
          if (err) console.log(err);
        }
      );
      return filethumbnail;
    }
  },

  readFile: async (path) => {
    console.log("  ********** readFile *****************");
    console.log(path, "  ********** pathreadFile *****************");
    return new Promise((resolve, reject) => {
      const readFile = util.promisify(fs.readFile);
      readFile(path)
        .then((buffer) => {
          resolve(buffer);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  writeFile: async (path, buffer) => {
    console.log("  ********** write file *****************");
    return new Promise((resolve, reject) => {
      const writeFile1 = util.promisify(fs.writeFile);
      writeFile1(path, buffer)
        .then((buffer) => {
          resolve(buffer);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  imageUploadMultiple: (files, folder = "images") => {
    if (!(typeof files == "object" && Array.isArray(files))) files = [files];

    let responseArray = [];
    if (Array.isArray(files) && files.length > 0) {
      files.map((file) => {
        if (file.name == "") return;

        let file_name_string = file.name;
        var file_name_array = file_name_string.split(".");
        var file_extension = file_name_array[file_name_array.length - 1];
        var letters = "ABCDE1234567890FGHJK1234567890MNPQRSTUXY";
        var result = "";
        // while (result.length<28)
        // {
        //     var rand_int = Math.floor((Math.random() * 19) + 1);
        //     var rand_chr= letters[rand_int];
        //     if (result.substr(-1, 1)!=rand_chr) result+=rand_chr;
        // }
        result = uuid();
        let name = result + "." + file_extension;
        // console.log(name);return false;
        file.mv("public/" + folder + "/" + name, function (err) {
          if (err) throw err;
        });
        responseArray.push(name);
      });
    }

    return responseArray;
  },

  imageUploadArray: (file, folder) => {
    let image = file;

    if (Array.isArray(image) === true) {
      temp_array = [];
      Promise.all(
        image.map(async (c) => {
          var extension = path.extname(c.name);

          if (extension != "") {
            var fileimage = uuid() + extension;
            c.mv(
              process.cwd() + `/public/${folder}/` + fileimage,
              function (err) {
                if (err) console.log(err);
              }
            );
            temp_array.push(fileimage);
          }
        })
      );
      return temp_array;
    } else {
      temp_array = [];

      var extension = path.extname(image.name);
      var fileimage = uuid() + extension;
      image.mv(
        process.cwd() + `/public/${folder}/` + fileimage,
        function (err) {
          if (err) console.log(err);
        }
      );

      temp_array.push(fileimage);
      return temp_array;
    }
  },

  comparePass: async (requestPass, dbPass) => {
    dbPass = dbPass.replace("$2y$", "$2b$");
    const match = await bcrypt.compare(requestPass, dbPass);
    return match;
  },
  vaildObjectApi: async function (required, non_required) {
    let message = "";
    let empty = [];

    for (let key in required) {
      if (required.hasOwnProperty(key)) {
        if (
          required[key] == undefined ||
          (required[key] === "" &&
            (required[key] !== "0" || required[key] !== 0))
        ) {
          empty.push(key);
        }
      }
    }

    if (empty.length != 0) {
      message = empty.toString();
      if (empty.length > 1) {
        message += " fields are required";
      } else {
        message += " field is required";
      }
      throw {
        code: 400,
        message: message,
      };
    } else {
      if (required.hasOwnProperty("securitykey")) {
        if (required.securitykey != process.env.SECURITY_KEY) {
          message = "Invalid security key";
          throw {
            code: 400,
            message: message,
          };
        }
      }

      const merge_object = Object.assign(required, non_required);
      delete merge_object.checkexit;
      delete merge_object.securitykey;

      if (
        merge_object.hasOwnProperty("password") &&
        merge_object.password == ""
      ) {
        delete merge_object.password;
      }

      for (let data in merge_object) {
        if (merge_object[data] == undefined) {
          delete merge_object[data];
        } else {
          if (typeof merge_object[data] == "string") {
            merge_object[data] = merge_object[data].trim();
          }
        }
      }

      return merge_object;
    }
  },

  success: function (res, message = "", body = {}) {
    return res.status(200).json({
      success: true,
      code: 200,
      message: message,
      body: body,
    });
  },

  failed: function (res, message = "", body = {}) {
    return res.status(400).json({
      success: false,
      code: 400,
      message: message,
      body: body,
    });
  },

  error: function (res, err, req) {
    console.log(err, "===========================>error");
    let code = typeof err === "object" ? (err.code ? err.code : 403) : 403;
    let message =
      typeof err === "object" ? (err.message ? err.message : "") : err;
    if (req) {
      req.flash("flashMessage", { color: "error", message });
      const originalUrl = req.originalUrl.split("/")[1];
      return res.redirect(`/${originalUrl}`);
    }

    return res.status(code).json({
      success: false,
      message: message,
      code: code,
      body: {},
    });
  },

  bcryptHash: async (newpassword, saltRounds = 8) => {
    try {
      hash = await bcrypt.hash(newpassword, saltRounds);
      return hash;
    } catch (error) {
      throw error;
    }
  },

  unixTimestamp: function () {
    var time = Date.now();
    var n = time / 1000;
    return (time = Math.floor(n));
  },

  create: async (req, data, model) => {
    try {
      return await model.create(data);
    } catch (error) {
      throw error;
    }
  },

  generate_auth_key: async function (get_auth_key) {
    let auth_create = crypto.randomBytes(30).toString("hex");

    return auth_create;
  },

  email_password_for_gmail: async function () {
    let data_email = {
      email_data: "mailtesting417@gmail.com",
      password_data: "Kaushal@123",
    };
    return data_email;
  },

  url_path: async function () {
    let url_path = "http://localhost:8048";

    return url_path;
  },

  sendPushNotification: async function (dataForSend) {
    console.log("hello wrodld");
    console.log(dataForSend);

    const apn = require("apn");

    const options = {
      token: {
        key: __dirname + "/AuthKey_Q3NW9UXH2J.p8",
        keyId: "Q3NW9UXH2J",
        teamId: "4XVQBWH9QF",
        //   keyId: "N62K9PCCD2",
        //   teamId: "4XVQBWH9QF"
      },
      production: false,
    };
    console.log("hello workd2 ");

    const apnProvider = new apn.Provider(options);
    console.log(dataForSend.device_token, "thisssssssssssssssis data");
    if (
      dataForSend &&
      dataForSend.device_token &&
      dataForSend.device_token != ""
    ) {
      console.log("ddkdkddk hellow rodld");
      const myDevice = dataForSend.device_token;
      console.log(dataForSend.device_token, "ankur sharma is my name");
      // const myDevice="8631447a2d0d3c73f48857832559c6c831e851e45fb479c31971a11b2e9d0b30"
      console.log(typeof myDevice);
      var note = new apn.Notification();

      console.log(myDevice);

      note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
      note.badge = 1;
      note.sound = "ping.aiff";
      //console.log(dataForSend);
      //console.log(dataForSend.msg);
      note.alert = dataForSend.msg;
      note.payload = { data: dataForSend };
      // note.topic = "cqlsys.BahamaEats";
      note.topic = "com.Whispchat.cqlsys";

      console.log("send note", note);

      apnProvider
        .send(note, myDevice)
        .then((result) => {
          // see documentation for an explanation of result
          console.log(result, "dkdkdkdk akdkdkddk");
          // return;
          console.log("send failed result", result.failed);
          //console.log("send err",err);
        })
        .catch((err) => {
          console.error("error while sending user notification", err);
        });
      // Close the server
      //apnProvider.shutdown();
    }
  },

  send_email: async function (get_param, req, res) {
    console.log(get_param, "get_param");
    var data = await db.users.findOne({
      where: {
        email: get_param.email,
      },
      raw: true,
    });
    /  console.log(data) /;
    if (data) {
      var email_password_get = await this.email_password_for_gmail();

      var url_data = await this.url_path();

      let auth_data = await this.generate_auth_key();
      / console.log(auth_data,"auth_data"); /;
      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: email_password_get.email_data,
          pass: email_password_get.password_data,
        },
      });
      var mailOptions = {
        from: email_password_get.email_data,
        to: get_param.email,
        subject: "Just ask Forgot Password",
        html: "Hello,<br> your otp is: " + get_param.otp,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });

      save = await db.users.update(
        {
          forgotPassword: auth_data,
        },
        {
          where: {
            id: data.id,
          },
        }
      );

      return transporter;
    } else {
      let msg = "Email not registered";
      return helper.success(res, msg, {});
    }
  },

  url_id_user: async function (req, res) {
    let get_password_data = await db.users.findOne({
      where: {
        forgotPassword: req.params.id,
      },
    });
    // console.log(get_password_data,'===========');return
    if (get_password_data) {
      res.render("provider_reset_password", {
        msg: req.flash("msg"),
        response: get_password_data,
      });
    } else {
      res.status(403).send("Link has been expired!");
    }
    return get_password_data;
  },

  reset_password_user_data: async function (
    req,
    res,
    new_data,
    update_password
  ) {
    const save = await db.users.update(
      {
        password: update_password,
      },
      {
        where: {
          id: new_data.hash,
        },
      }
    );
    var update_link = await db.users.update(
      {
        forgotPassword: "",
      },
      {
        where: {
          id: new_data.hash,
        },
      }
    );
    if (save) {
      res.render("success_page", { msg: "Password changed successfully" });
    } else {
      res.render("success_page", { msg: "Invalid user" });
    }
  },

  social_login: async function (get_social_data, req, res) {
    console.log(
      get_social_data,
      "=========This is data which we got from font end via api=========="
    );

    let get_social_dataa = await db.users.findOne({
      where: {
        socialId: get_social_data.social_id,
        //status: 0
      },
      raw: true,
    });
    console.log("hellow orldd");
    // if (get_social_dataa) {
    //   let msg = 'Please contact with admin';
    //   jsonData.wrong_status(res, msg)
    //   return false;
    // }
    let check_social_id = await db.users.findOne({
      where: {
        socialId: get_social_data.social_id,
      },
      raw: true,
    });

    if (check_social_id) {
      create_social_login = await db.users.update(
        {
          device_token: get_social_data.device_token,
          device_type: get_social_data.device_type,
          // full_name: get_social_data.full_name,
          email: get_social_data.email,

          // country_code: get_social_data.country_code,
          //phone: get_social_data.phone,
          image: get_social_data.image,
        },
        {
          where: {
            socialId: check_social_id.socialId,
          },
        }
      );

      //  create_social_login = JSON.stringify(create_social_login);
      //           const customer = await stripe.customers.create({
      //               email: get_social_data.email,
      //           });

      //           stripe_id = customer.id;

      //           const update_details = await db.users.update({
      //               stripe_id: stripe_id
      //               }, {
      //               where: {
      //                   socialId: check_social_id.socialId,
      //               }
      //           });
      let get_social_data_user_1 = await db.users.findOne({
        where: {
          id: check_social_id.id,
        },
        raw: true,
      });
      return get_social_data_user_1;
    } else {
      console.log("emailssss");
      var get_email = await db.users.findOne({
        attributes: ["id", "email"],
        where: {
          email: get_social_data.email,
        },
        raw: true,
      });
      console.log(get_email, "--------------ankur");
      if (get_email) {
        let msg = "Email Already Exist";
        jsonData.wrong_status(res, msg);
        return false;
      }
      create_social_login = await db.users.create({
        socialId: get_social_data.social_id,
        socialType: get_social_data.social_type,
        device_token: get_social_data.device_token,
        device_type: get_social_data.device_type,
        full_name: get_social_data.full_name,
        email: get_social_data.email,
        // country_code: get_social_data.country_code,
        //phone: get_social_data.phone,
        image: get_social_data.image,
      });
      // create_social_login = create_social_login.toJSON();
      //           const customer = await stripe.customers.create({
      //               email: get_social_data.email,
      //           });

      //           stripe_id = customer.id;

      //           const update_details = await db.users.update({
      //               stripe_id: stripe_id
      //               }, {
      //               where: {
      //                   id: create_social_login.id,
      //               }
      //           });
      let get_social_data_user = await db.users.findOne({
        where: {
          id: create_social_login.id,
        },
        raw: true,
      });
      return get_social_data_user;
    }
  },

  async sendNotification(token, data, deviceType) {
    console.log("---");
    if (deviceType == 1) {
      //var serverKey = 'AAAAFnJtC-I:APA91bHFPiNGzfX93MyVh9cxDHtL6k-YNFUPw6hVSGxmyQQmzG3pWvq3V97cU3b4C5ljMZDp3XT9e8r3VxP9ZDM3PhVzkSSwSqKBj5TuU2yaYySpmwnx8tdcBC1WScaoDS1wzp-EhpgH'; //put your server key here
      var serverKey =
        "AAAArDGxX34:APA91bFnV-lSOKxx4u77wZKMduAPPAT6ZXt3GodhKCLqqiD6Xmts-jggb3FNjovKZGjr1ypqQuaYOzAVU0_fxHqphU5iHXTSvLJOn8ARGyEaRMzVaMkSoc0GznAHdKzrSWJ2a52mek8p";
      var fcm = new FCM(serverKey);

      // data.title = constants.appName;
      var message = {
        // to: token,
        registration_ids: token,
        collapse_key: "your_collapse_key",
        data: data,
      };
      console.log("======================", message);
      fcm.send(message, function (err, response) {
        if (err) {
          console.log("Something has gone wrong!", err);
          return false;
        } else {
          console.log("Successfully sent with response: ", response);
          return true;
        }
      });
    } else {
      var apnProvider = new apn.Provider(options);
      var note = new apn.Notification();
      note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
      note.badge = 1;
      note.sound = "default";
      note.alert = data.message;
      note.title = "justask";
      note.payload = data;
      note.topic = "com.dummy.Just-Ask";
      console.log(note);
      apnProvider.send(note, token).then((result) => {
        console.log(result, "resul1-----------");
        return result;
      });
    }
  },


  getBcryptHash: async (keyword) => {
    const saltRounds = 10;
    var myPromise = await new Promise(function (resolve, reject) {
        bcrypt.hash(keyword, saltRounds, function (err, hash) {
            if (!err) {

                resolve(hash);
            } else {
                reject('0');
            }
        });
    });
    // required.password= crypto.createHash('sha1').update(required.password).digest('hex');
    keyword = myPromise;
    return keyword;
},

files_upload: async function(image,folderName){
  if (image) {
       var extension = path.extname(image.name);
       var filename = uuid() + extension;
       var sampleFile = image;
       sampleFile.mv(process.cwd() + `/public/images/${folderName}/` + filename, (err) => {
           if (err) throw err;
       });

       return filename;
   }

},

send_emails: function(otp,email,resu) {
        
  try {
      const nodemailer = require('nodemailer');
      
          var transporter = nodemailer.createTransport({
            host: "smtp.mailtrap.io",
            port: 2525,
            auth: {
              user: "0ceed3d9c5ba7d",
              pass: "12053b661b94e9"
            }
          });
        

          var mailOptions = {
          from: 'test978056@gmail.co',
          to: email,
          subject:  'Atara: Forgot password',
          html: `Hi, ${email} your otp is ${otp} please verify once and reset your password`     
          };  
   
          transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
          console.log(error);
          } else {
          console.log(info);
          res.send('Email send');
          }
        });
       return resu;
  } catch (err) {
    throw err;
  }
  }, 

  findUser:async(email)=>{
    const userdata = await db.users.findOne({
      where:{
        email:email
      }
    })

    console.log(userdata,'===============helplerr userdatata=========')
    return userdata
  },


  email_password_for_gmail: async function () {

    let data_email = {
        email_data: 'mailto:mailtesting417@gmail.com',
        password_data: 'Kaushal@123'
    }
    return data_email;
  },

  url_path: async function (req,res) {
    let url_path = `${req.protocol}://${req.get(
      "host"
    )}`
    return url_path;
  },


  generate_auth_key: async function (get_auth_key) {

    let auth_create = crypto.randomBytes(30).toString('hex');

    return auth_create;
  },

  pro_send_email: async function (get_param, req, res) {

    // console.log(get_param, "get_param");
    var data = await db.users.findOne({
        where: {
            email: get_param.email,
            // role:2
        },
        raw: true,
    });
    /  console.log(data) /
    if (data) {

        var email_password_get = await this.email_password_for_gmail();

        var url_data = await this.url_path(req);

        let auth_data = await this.generate_auth_key();
        await db.users.update({resetpassword_token:auth_data},{where:{
          email:data.email
        }})

        / console.log(auth_data,"auth_data"); 
        // var transporter = nodemailer.createTransport({
        //     service: 'gmail',
        //     auth: {
        //         user: email_password_get.email_data,
        //         pass: email_password_get.password_data
        //     }
        // });

        var transporter = nodemailer.createTransport({
          host: "smtp.mailtrap.io",
          port: 2525,
          auth: {
            user: "0ceed3d9c5ba7d",
            pass: "12053b661b94e9"
          }
        });
      
        var mailOptions = {

            from: email_password_get.email_data,
            to: get_param.email,
            subject: 'Atara Forgot Password',
            html: 'Click here for change password <a href="' +
                url_data +
                "/api/reset_password/" +
                auth_data +
                '"> Click</a>'
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });

        save = await db.users.update({
            forgotPassword: auth_data,
        }, {
            where: {

                id: data.id

            }
        });
        507
        return transporter;
    } else {

        let msg = 'Email not registered';
        throw msg
    }

},
};
