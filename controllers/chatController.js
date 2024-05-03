const db = require('../models');
const helper = require('../helpers/helper');
const sequelize = require("sequelize");
const Op = sequelize.Op;
const User = db.users;
const User2 = db.users;
const chat = db.chat;
const chatConstant = db.constant;
const moment = require('moment');
chatConstant.belongsTo(User, {foreignKey: 'userid'})
chat.belongsTo(User, {foreignKey: 'user2Id'});
chat.belongsTo(User2, {foreignKey: 'userid'});

module.exports = {

    chatList: async(req,res)=>{
        try {
        if (!req.session.user) return res.redirect("/admin");
        //console.log( global.adminData.id,'================================================')
      const chatconstant = await chatConstant.findAll({
        where:{
          [Op.or]:[
            {userid:req.session.user.id},
            {user2Id:req.session.user.id}
          ],
          deletedId:{[Op.ne]:req.session.user.id}
        }
      });
      var users_data =  await chatConstant.findAll({
        attributes:['id','userid','user2Id',[sequelize.literal('(SELECT name FROM users WHERE constant.user2id = users.id)'), 'userByname'],[sequelize.literal('(SELECT message FROM chat WHERE constant.last_msg_id = chat.id)'), 'lastMsg'],[sequelize.literal('(SELECT COUNT(*) FROM chat WHERE constant.id=chat.constantid AND chat.read_status=0)'), 'count']],
           order: [
             ['id', 'DESC'],
         ],   
         include:[{
          model:User,
          required:true,
          attributes:['id','name','image']
         }],  
         where:{
          [Op.or]:[
            {userid:req.session.user.id},
            {user2Id:req.session.user.id}
          ],
        }
        });

        users_data = users_data.map(value => {
             return value.toJSON();
         });
     console.log(users_data);

      return res.render('chats/chatlist', { 
        response:users_data,
        session: req.session.user,msg: req.flash('msg'),
     
      });

    }
    catch (err) {
        console.log("error is",err);
      }
    },


    showchat: async(req,res)=>{
        try {
        if (!req.session.user) return res.redirect("/admin");
        //console.log( global.adminData.id,'================================================')
        var users_data2 = await chat.findAll({
            // attributes:['id','user2Id','userid','message','constantid','createdAt'], 
             include:[{
               model:User,
               required:false,
               attributes:['id','name','image']
              }],
             where: {
               constantid:req.query.id,
               //userid:req.query.user2id
             },
           });
        //console.log(req.query.user2id);
       // console.log(req.query,"--------------req.query");
          await chat.update({
                    readStatus:1
                }, {
                    where: {
                    constantid:req.query.id,
                    user2id:req.query.user2id
                }
            });
//console.log(users_data2,"--------------------update");
           let SeconduserMsg= users_data2.map(users_data2=>{
             return users_data2.toJSON()
            });
           console.log(SeconduserMsg[0].user.image,"=========SeconduserMsg");
       res.render('chats/showchat',
           {
           //  FirstuserMsg:FirstuserMsg,
             SeconduserMsg:SeconduserMsg,
             constantId: req.query.id,
             userid: req.query.userid,
             user2Id: req.query.user2id,
             loginUserId: req.session.user.id,
             moment: moment,
             session: req.session.user,msg: req.flash('msg')
            
           
           });

    }
    catch (err) {
        console.log("error is",err);
      }
    },
    }


