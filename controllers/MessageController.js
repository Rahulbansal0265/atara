
const e = require('express');
var path = require('path');
const db = require('../models')
const bcrypt = require('bcrypt')
const uuid = require('uuid').v4;
var Sequelize = require('sequelize');
const Op = Sequelize.Op;
var nodemailer = require('nodemailer');
const helper = require("../helpers/helper");
// const e = require('express');

module.exports = {
    sendMessage: async (req, res) => {
        if (!req.session.user) return res.redirect("/admin");
        const users = await db.users.findAll({
            where: {
                type: {
                    [Op.or]: [2, 3]
                }
            }
        });
        res.render('messages/send_message', { session: req.session.user, users, msg: req.flash('msg') });
    },
    messageSent: async (req, res) => {
        try {
            if (!req.session.user) return res.redirect("/admin");
            let users = req.body.users;
            if (Array.isArray(users) == true) {
                console.log(users);
                //console.log(req.session.user.id);
                requests = await Promise.all(users.map(async (val) => {

                    let user = await db.users.findOne({
                        where: {
                            id: val
                        }, raw: true,
                    });
                    let message = await db.messages.create({
                        by_user: req.session.user.id,
                        to_user: val,
                        message: req.body.content

                    });
                    let notificationdata = {
                        title: "Admin message to you",
                        message: req.body.content,
                        senderId: req.session.user.id,
                        receiverId: val,
                        type: 2
                    }
                    device_token = user.device_token;
                    deviceType = user.device_type;
                    result = await helper.sendNotification(device_token, notificationdata, deviceType);
                  
                }));
            } else {
                console.log(users);
                let user = await db.users.findOne({
                    where: {
                        id: users
                    }, raw: true,
                });
                let message = await db.messages.create({
                    by_user: req.session.user.id,
                    to_user: user.id,
                    message: req.body.content

                });
                let notificationdata = {
                    title: "Admin message to you",
                    message: req.body.content,
                    senderId: req.session.user.id,
                    receiverId: users,
                    type: 2
                }
                device_token = user.device_token;
                deviceType = user.device_type;
                result = await helper.sendNotification(device_token, notificationdata, deviceType);
            }
            req.flash('msg', 'Message Sent Successfully');
            res.redirect("/send_message")
        } catch (err) {
            console.log("error is", err);

        }
    },
    sendEmail: async (req, res) => {
        if (!req.session.user) return res.redirect("/admin");
        const users = await db.users.findAll({
            where: {
                type: {
                    [Op.or]: [2, 3]
                }
            }
        });
        res.render('messages/send_email', { session: req.session.user, users, msg: req.flash('msg') });
    },
    emailSent: async (req, res) => {
        if (!req.session.user) return res.redirect("/admin");
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'youremail@gmail.com',
                pass: 'yourpassword'
            }
        });
        let users = req.body.users;
        console.log(Array.isArray(users));
        if (Array.isArray(users) == true) {
            console.log(users);
            requests = await Promise.all(users.map(async (val) => {
                let user = await db.users.findOne({
                    where: {
                        id: val
                    }, raw: true,
                });
                var mailOptions = {
                    from: 'youremail@gmail.com',
                    to: user.email,
                    subject: req.body.subject,
                    text: req.body.content
                };
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        req.flash('msg', error);

                    }
                });
            }));
        } else {
            console.log(users);
            let user = await db.users.findOne({
                where: {
                    id: users
                }, raw: true,
            });
            var mailOptions = {
                from: 'youremail@gmail.com',
                to: user.email,
                subject: req.body.subject,
                text: 'That was easy!'
            };
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    req.flash('msg', error);

                }
            });
        }
        req.flash('msg', 'Email Sent Sucessfully!!');
        res.redirect("/send_email")
    }





}