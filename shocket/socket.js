const db = require('../models');
const sequelize = require('sequelize');
const Op = sequelize.Op;
const admin = db.admin;
const users = db.users;
const chat = db.chat;
const constant = db.constant;
const onlineUser = db.onlineUser;
var notifications = db.notifications
const blockedUser = db.blockedUsers;
const fun = require('./functions/socketFunction');
const Helper = require('../helpers/helper');
const { get } = require('config');
db.chat.belongsTo(users, { foreignKey: 'userid', as: 'sender' });
db.chat.belongsTo(users, { foreignKey: 'user2id', as: 'Receiever' });
module.exports = function (io) {

  io.on('connection', function (socket) {
    console.log('a user connected');

    socket.on('connect_user', async function (connect_listener) {
      try {

        var socket_id = socket.id
        let check_user = await onlineUser.findOne({
          where: {
            userid: connect_listener.userid
          }
        });
        // console.log(socket_id);

        if (check_user) {

          create_socket_user = await onlineUser.update({
            status: 1,
            socketId: socket_id,
          }, {
            where: {
              userid: connect_listener.userid
            }
          }
          );

        } else {
          create_socket_user = await onlineUser.create({
            userid: connect_listener.userid,
            socketId: socket_id,
            status: 1,
          })
        }
        success_message = [];
        success_message = {
          'success_message': 'connected successfully'
        }
        socket.emit('connectUser', success_message);
      } catch (error) {
        console.log(error, "=========error========")
        throw error
      }
    });



    socket.on('connect_admin', async function (connect_listener) {
      try {
        var socket_id = socket.id
        let check_user = await onlineUser.findOne({
          where: {
            userid: connect_listener.userid
          }
        });
        // console.log(socket_id);

        if (check_user) {

          create_socket_user = await onlineUser.update({
            status: 1,
            socketId: socket_id,
          }, {
            where: {
              userid: connect_listener.userid
            }
          }
          );

        } else {
          create_socket_user = await onlineUser.create({
            userid: connect_listener.userid,
            socketId: socket_id,
            status: 1,
          });

        }
        success_message = [];
        success_message = {
          'success_message': 'connected successfully'
        }
        socket.emit('connect_admin_listener', success_message);
      } catch (error) {
        throw error
      }
    });



    socket.on('send_message', async function (get_data) {
      // console.log("ankur shamra");
      //  console.log(get_data,"===============++ start here");
      //  return;
      try {
         
      //  console.log("ankur shamra");
        let find_block = await blockedUser.findOne({
          where: {
                 [Op.or]: [
                     { userby:get_data.user2Id, userto:get_data.userId},
                     { userby:get_data.userId, userto: get_data.user2Id}
                     
                   ]
                 }
          // where: {
          //   userby: get_data.user2Id,
          //   userto: get_data.userId
          // }
        });

        if (!find_block) {
          var user_data="";
          var productid="";
          var blockstatu="";
        //  if(get_data.msg)
          // if (get_data.msgType == 1) {
          //   extension_data = get_data.extension
          //   convert_image = await fun.image_base_64(get_data.message, extension_data);
          //   get_data.message = convert_image;
          // }
        //     if(get_data.productId!="")
        //     {
        //      
        //   user_data = await constant.findOne({
        //     where: {
        //       [Op.or]: [
        //         { userid: get_data.userId, user2Id: get_data.user2Id,product_id:get_data.productId },
        //         { user2Id: get_data.userId, userid: get_data.user2Id,product_id:get_data.productId }
                 
        //       ]
        //     }
        //   });
        //   // console.log(user_data,"=================>");
        //   // return;
        // }
        //else{
          //productid=0;
              
           user_data = await constant.findOne({
            where: {
              [Op.or]: [
                { userid: get_data.userId, user2Id: get_data.user2Id, },
                { user2Id: get_data.userId, userid: get_data.user2Id }
                 
              ]
            }
          });
     //   }  
          //  user_data = await constant.findOne({
          //   where: {
          //     [Op.or]: [
          //       { userid: get_data.userId, user2Id: get_data.user2Id },
          //       { user2Id: get_data.userId, userid: get_data.user2Id }
                 
          //     ]
          //   }
          // });
          // console.log(user_data,"======user_data====");return;
           console.log("sankru");
          if (user_data) {
            //  console.log(user_data,"aaaaaaaaaaaaaaaaaanur");
            //  return;
              console.log(get_data,"====================ankur sharma ");
             //return;
           //  console.log(user_data,"===============++ coming here"); return
            create_message = await chat.create({
              userid: get_data.userId,
              user2id: get_data.user2Id,
              msg_type: get_data.msgType,
              message: get_data.message,
              constantid: user_data.dataValues.id,
               product_id:get_data.productId?get_data.productId:0,
              createdAt: await fun.create_time_stamp(),
              updatedAt: await fun.create_time_stamp(),
            })
            //  console.log(create_message,"+=====================after chat inserted")
            // return;
            // if(get_data.productId!="")
            // {
          //       console.log("ankur 1");
          //     update_last_message = await constant.update({

          //       lastMsgId: create_message.dataValues.id,
          //       userLastMsgId: create_message.dataValues.id,
          //       user2LastMsgId: create_message.dataValues.id,
          //       delete_id: 0,
          //       updatedAt: await fun.create_time_stamp(),
          //     },
          //       {
          //         where: {
          //           id: user_data.dataValues.id,
          //           product_id:user_data.dataValues.product_id,
          //         }
          //       }
          //     );
          // //  }
          //   else{
          //     console.log("ankur 2");
            update_last_message = await constant.update({

              lastMsgId: create_message.dataValues.id,
              userLastMsgId: create_message.dataValues.id,
              user2LastMsgId: create_message.dataValues.id,
              deletedId: 0,
              updatedAt: await fun.create_time_stamp(),
            },
              {
                where: {
                  id: user_data.dataValues.id
                }
              }
            );
         //   }
            let get_user_details = await users.findOne({
              where: {
                id: get_data.user2Id
              }
            });

            var get_user = await users.findOne({
              where: {
                id: get_data.userId
              }
            });

            var lastMessage = await chat.findOne({
              where: {
                id: create_message.dataValues.id
              }
            });

            let find_block = await blockedUser.findOne({
              where: {
                userby: get_data.user2Id,
                userto: get_data.userId
              }
            });

            let blockCount = await blockedUser.count({
              //  attributes: [`id`, `first_name`, `image`],
                where: {
                  userby: get_data.user2Id,
                  userto:get_data.userId,
                    status:1
                },
                raw: true
            });
            let sender = await db.users.findOne({
              attributes: [`id`, `device_token`, `device_type`, `notificationStatus`,`full_name`,`image`,`notificationStatus`],
              where: {
                  id: get_data.userId
              },
              raw: true,
              nest:true,
          });
       
          let reciever = await db.users.findOne({
            attributes: [`id`, `device_token`, `device_type`, `notificationStatus`,`full_name`,`image`,`notificationStatus`],
            where: {
                id: get_data.user2Id
            },
            raw: true,
            nest:true,
        });
       
        userdata2={
          receiver:reciever,
          sender:sender,
          lastMessage: lastMessage.dataValues.message,
        }
            // let device_token = get_user_details.dataValues.device_token;
            // let deviceType = get_user_details.dataValues.device_type;
            // const notificationdata = {
            //   title: 'New message',
            // //  message: get_user.dataValues.name + " sent you new message",
            //  // otherUserId: get_user.dataValues.id,
            //  // userName: get_user.dataValues.name,
            //  // image: get_user.dataValues.image,
            //  // type: 5
            // }
          //  console.log(userdata2.receiver.device_token,"==========this is our test data");
          //  return;
            let notification_data = {
              device_token:userdata2.receiver.device_token,
              msg: 'You have received a new message',
              body: userdata2,
              prodcutdetails:lastMessage,
              pushtype:1,
              isblocked:blockCount,
              // isblocked:blockCount,
              // isunmatched:unmatchCOunt,
          }
          notfiycreate = await db.notifications.create({
            user_id: get_data.userId,
            user2id: get_data.user2Id,
            type: 4,
            message:`${sender.full_name} has sent you a message`,
            // constantid: user_data.dataValues.id,
            //  product_id:get_data.productId?get_data.productId:0,
            // createdAt: await fun.create_time_stamp(),
            // updatedAt: await fun.create_time_stamp(),
          })
           console.log(notfiycreate,"annnnnnnnnnnlursharma");
           if(reciever.notificationStatus==0)
           {
            
          let aaa=await Helper.sendPushNotification(notification_data);
          console.log(aaa,"---------------------------------ankru");
           }

         // console.log(aaa,"push ressssssssssssssssssss");
            //  console.log(create_message.dataValues.id,"+=====================after chat inserted")
            // return
            // if(get_user_details.dataValues.is_notification == 1){
           //let sendpush= await Helper.sendNotification(device_token, notificationdata, deviceType);
            //  }

            //  let chatdatassss= await db.chat.findOne({
            //   where:{
            //     id:create_message.dataValues.id
            //   }
            //  })
            //  console.log(chatdatassss,">>>>>>>>>>>>>>>>>>>>>>")
            //  return

            var getdata = await db.chat.findOne({
              // attributes: ['id', [sequelize.literal('(SELECT name FROM users WHERE users.id  = chat.userid)'), 'SenderName'], 'message',
              // [sequelize.literal('(SELECT id FROM users WHERE users.id  = chat.userid)'), 'SenderID'],
              //   [sequelize.literal('(SELECT image FROM users WHERE users.id  = chat.userid)'), 'SenderImage'],
              //   [sequelize.literal('(SELECT name FROM users WHERE users.id  = chat.user2Id)'), 'ReceiverName'],
              //   [sequelize.literal('(SELECT id FROM users WHERE users.id  = chat.user2Id)'), 'ReceiverId'],
              //   [sequelize.literal('(SELECT image FROM users WHERE users.id  = chat.user2Id)'), 'ReceiverImage'], 'msgType', 'createdAt'],
              // include: [{
              //   //  attributes:['full_name,image'],
              //   model: db.users,
              //   as: 'sender',
              //   attributes: ['image', 'full_name', 'id'],
              // },
              // {
              //   model: db.users, as: 'Receiever',
              //   attributes: ['image', 'full_name', 'id'],
              // }
              // ],
              attributes: {
                include: [
                   
                  [sequelize.literal('(SELECT id FROM users WHERE users.id  = chat.userid)'), 'SenderID'],
                  [sequelize.literal('(SELECT image FROM users WHERE users.id  = chat.userid)'), 'SenderImage'], 
                  [sequelize.literal('(SELECT full_name FROM users WHERE users.id  = chat.userid)'), 'sendername'],
                    
                  [sequelize.literal('(SELECT id FROM users WHERE users.id  = chat.user2id)'), 'ReceiverID'],
                  [sequelize.literal('(SELECT image FROM users WHERE users.id  = chat.user2id)'), 'ReceiverImage'], 
                  [sequelize.literal('(SELECT full_name FROM users WHERE users.id  = chat.user2id)'), 'Receivername'],
           
            ],
            
            },

              where: {
                id: create_message.dataValues.id
              }
            });
            getdata.dataValues.myblockstatus="";
             console.log(getdata.dataValues,"==========================================================================get data");
            if (getdata) {

              var get_id = await onlineUser.findOne({
                where: {
                  userid: get_data.user2Id
                },
                raw: true,
              });
                   console.log(get_id,"->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
              // if (get_id) {
              //    socket.emit("body", getdata);
              //  } 
              socket.emit("sendMessage", getdata);
              io.to(get_id.socketId).emit('sendMessage', getdata);
            }

          } else {

            console.log("ankur shsake>>>>>>>>>>>>>>>>>>>>>>>>>>");
            // return;
            let create_last_message = await constant.create({
              userid: get_data.userId,
              user2Id: get_data.user2Id,
              lastMsgId: 0,
              product_id:get_data.productId?get_data.productId:0,
              userLastMsgId: 0,
             // delete_id:0,
              user2LastMsgId: 0,
            });
            
            var create_message = await chat.create({
              userid: get_data.userId,
              user2id: get_data.user2Id,
              msg_type: get_data.msgType,
              message: get_data.message,
              constantid: create_last_message.dataValues.id,
              product_id:get_data.productId?get_data.productId:0,
              createdAt: await fun.create_time_stamp(),
              updatedAt: await fun.create_time_stamp(),

            });
           
            var update_last_message = await constant.update({
              lastMsgId: create_message.dataValues.id,
              userLastMsgId: create_message.dataValues.id,
              user2LastMsgId: create_message.dataValues.id,
              updatedAt: await fun.create_time_stamp(),
            },
              {
                where: {
                  id: create_last_message.dataValues.id
                }
              }
            );
           
            //let get_user_details = await my_function.get_user_details_for_push(get_data)
            let get_user_details = await await users.findOne({
              where: {
                id: get_data.user2Id
              }
            });
   
            var get_user = await users.findOne({
              where: {
                id: get_data.userId
              }
            });
            let find_block = await blockedUser.findOne({
              where: {
                userby: get_data.user2Id,
                userto: get_data.userId
              }
            });

            // let deviceToken = get_user_details.dataValues.device_token;
            // let deviceType = get_user_details.dataValues.device_type;
            const data = {
              title: 'BallerPage',
              message: get_user.dataValues.name + " sent you new message",
              post_id: 0,
              otherUserId: get_user.dataValues.id,
              userName: get_user.dataValues.name
            }
          
            // if (get_user_details.dataValues.is_notification == 1) {
            //   let sendpush = await Helper.send_push_notification(3, deviceType, deviceToken, data);
            // }

            //  var getdata = await chat.findOne({
            //      attributes: ['id',
            //        [sequelize.literal('(SELECT name FROM users WHERE users.id=  chat.userid)'), 'SenderName'], 'message',
            //        [sequelize.literal('(SELECT id FROM users WHERE users.id= chat.userid)'), 'SenderID'],
            //        [sequelize.literal('(SELECT image FROM users WHERE users.id=  chat.userid)'), 'SenderImage'], 
            //        [sequelize.literal('(SELECT name FROM users WHERE users.id=  chat.user2Id)'), 'ReceiverName'],
            //        [sequelize.literal('(SELECT id FROM users WHERE users.id= chat.user2Id)'), 'ReceiverId'],
            //          [sequelize.literal('(SELECT image FROM users WHERE users.id  = chat.user2Id )'), 'ReceiverImage'], 'msgType', 'createdAt'],
            //          where: {
            //            id: create_message.dataValues.id,
            //          }
            //    });

            var getdata = await chat.findOne({
              // attributes: ['id', [sequelize.literal('(SELECT name FROM users WHERE users.id  = chat.userid)'), 'SenderName'], 'message',
              // [sequelize.literal('(SELECT id FROM users WHERE users.id  = chat.userid)'), 'SenderID'],
              //   [sequelize.literal('(SELECT image FROM users WHERE users.id  = chat.userid)'), 'SenderImage'],
              //   [sequelize.literal('(SELECT name FROM users WHERE users.id  = chat.user2Id)'), 'ReceiverName'],
              //   [sequelize.literal('(SELECT id FROM users WHERE users.id  = chat.user2Id)'), 'ReceiverId'],
              //   [sequelize.literal('(SELECT image FROM users WHERE users.id  = chat.user2Id)'), 'ReceiverImage'], 'msgType', 'createdAt'],
              include: [{
                //  attributes:['full_name,image'],
                model: db.users, as: 'sender',
                attributes: ['image', 'full_name', 'id'],
              },
              {
                model: db.users, as: 'Receiever',
                attributes: ['image', 'full_name', 'id'],
              }
              ],


              where: {
                id: create_message.dataValues.id
              }
            });
            console.log(getdata,"---------------------->----------------->");
            getdata.blocstatus="";
          //  let abcc={
          //   getdata,
          //   blockstatu,
          //  }

            if (getdata) {

              var get_id = await onlineUser.findOne({
                where: {
                  userid: get_data.user2Id
                },
                raw: true
              });
              let userdata2 = await db.users.findOne({
                attributes: [`id`, `device_token`, `device_type`, `notificationStatus`,],
                where: {
                    id: get_data.user2Id
                },
                raw: true
            });
            // console.log(create_last_message.dataValues.id);
            // return;
              let notification_data = {
                device_token:userdata2.device_token,
                msg: 'You have received a new message',
                body: userdata2,
                data: lastMessage,
                pushtype:1,
                // isblocked:blockCount,
                // isunmatched:unmatchCOunt,
            }
            getdata.dataValues.myblockstatus="";


            let aaa=await Helper.sendPushNotification(notification_data);

              if (get_id) {
                socket.emit("sendMessage", getdata);
              } else {
                socket.emit("sendMessage", getdata);
              }
              io.to(get_id.socketId).emit('sendMessage', getdata);
            }

          }
        }
      
    //  }
     
        else {
          console.log("ahddjdjdj");
          success_message = []
          success_message = {
            myblockstatus: 'You are blocked by this user'
          }
          // socket.emit('body', success_message);
          socket.emit('sendMessage', success_message);
        }
      } catch (error) {
        console.log(error, "======error")
        throw error
      }
    });

    socket.on('get_message', async function (data) {
      console.log(data);
      if (data) {
        var get_data_chat = await fun.GetChat(data);
        console.log(get_data_chat, "get_data_chatget_data_chat")

        if (get_data_chat) {
          socket.emit('getMessage', get_data_chat);
        }
      }

    });

    socket.on('read_all', async function (data) {
      console.log(data);
      let update_read_status = await chat.update({
        readStatus: 1
      },
        {
          where: {
            
            user2id: data.userid,
            userid:data.user2Id,
            
          }
        });
        console.log(update_read_status);
        if (update_read_status) {
          socket.emit('read_all', "updated successfully");
        }
      });

      socket.on('undread_count_all', async function (data) {
        const count = await chat.count({
          where: { 
            user2id: data.user2Id,
            read_status:0,
           },
           group: ['user2id']    
        });
        console.log(count.length);
        let arb={
           count:0,
         }
         
        if (count.length>0) {
        //  console.log("aaaaaaaaaankur")
          socket.emit('undread_count_all',  count[0]);
        }
        else{
          //console.log("ankru");
          socket.emit('undread_count_all',arb);
        }
        });

 

    socket.on('chat_listing', async function (data) {
      try {
        if (data) {
          var get_list = await fun.get_chat_list(data);
          if (get_list) {
            socket.emit('chatListing', get_list);
          }

        }
      } catch (error) {
        console.log(error, "========error=========");
      }

    });

    // socket.on('delete_User_chat', async function (deleted_data) {
    //   try {

    //   var otherIds = deleted_data.user2Id;

    //   var conditionData = [];
    //   for(let i in otherIds){

    //     conditionData.push(
    //         { userid: deleted_data.userid, user2Id: otherIds[i]},
    //         { userid: otherIds[i], user2Id: deleted_data.userid},
    //     );

    //   } 
    //   // console.log(conditionData);return

    //     var findNotDeletedCount = await constant.findAll({
    //       where: {
    //         deletedId: 0,
    //         [Op.or]: conditionData
    //       }
    //     });

    //     var findDeletedCount = await constant.findAll({
    //       where: {
    //         deletedId: {
    //           [Op.not] : 0
    //         },
    //         [Op.or]: conditionData
    //       }
    //     });

    //     // console.log(findNotDeletedCount);return

    //     let getNotDeletedConstantIds = findNotDeletedCount.map(ids => {
    //       return ids.id;
    //     });
    //     // console.log(getNotDeletedConstantIds);

    //     let getDeletedConstantIds = findDeletedCount.map(ids => {
    //       return ids.id;
    //     });
    //     // console.log(getDeletedConstantIds);return

    //     if (getDeletedConstantIds.length > 0) {

    //           var deleteChat = await constant.destroy({
    //             where: {
    //               id: getDeletedConstantIds
    //             }
    //           });

    //     }

    //     if(getNotDeletedConstantIds.length > 0){

    //       var deleteChat = await constant.update({
    //         deletedId: deleted_data.userid
    //         },
    //           {
    //             where: {
    //               id: getNotDeletedConstantIds
    //             }
    //       });
    //     }

    //   success_message = []
    //   success_message = {
    //     'success_message': 'Chat deleted Successfully'
    //   }
    //   socket.emit('delete_chat_data', success_message);

    //   } catch (error) {
    //     throw error
    //   }
    // });

    socket.on('delete_chat', async function (delete_chat) {
      try {

        let delete_chat_data = await fun.delete_msg(delete_chat)
        success_message = []
        success_message = {
          'success_message': 'Chat Deleted Successfully'
        }

        socket.emit('deleteChat', success_message);

      } catch (error) {
        throw error
      }
    });


    socket.on('delete_msg_in_chat', async function (deleted_data) {
      try {

        var msgIds = deleted_data.msgId;

        var conditionData = [];
        for (let i in msgIds) {

          conditionData.push(
            { id: msgIds[i] },
          );

        }
        // console.log(conditionData);

        var findNotDeletedCount = await chat.findAll({
          where: {
            deletedId: 0,
            [Op.or]: conditionData
          }
        });

        var findDeletedCount = await chat.findAll({
          where: {
            deletedId: {
              [Op.not]: 0
            },
            [Op.or]: conditionData
          }
        });

        // console.log(findNotDeletedCount);
        // console.log(findDeletedCount);return


        let getNotDeletedMessageIds = findNotDeletedCount.map(ids => {
          return ids.id;
        });
        // console.log(getNotDeletedMessageIds);

        let getDeletedMessageIds = findDeletedCount.map(ids => {
          return ids.id;
        });
        // console.log(getDeletedMessageIds);return

        if (getDeletedMessageIds.length > 0) {

          var deleteChat = await chat.destroy({
            where: {
              id: getDeletedMessageIds
            }
          });

        }

        if (getNotDeletedMessageIds.length > 0) {

          var deleteChat = await chat.update({
            deletedId: deleted_data.userid
          },
            {
              where: {
                id: getNotDeletedMessageIds
              }
            });
        }

        // var findChatConstant = await constant.findOne({
        //   where: {
        //     [Op.or]: [
        //       { userid: deleted_data.userid, user2Id: deleted_data.user2Id },
        //       { user2Id: deleted_data.userid, userid: deleted_data.user2Id }
        //     ]
        //   },
        //   raw: true,
        // });

        // var findChat = await chat.findOne({
        //   where: {
        //     deletedId: 0,
        //     [Op.or]: [
        //       { userid: deleted_data.userid, user2Id: deleted_data.user2Id},
        //       { user2Id: deleted_data.userid, userid: deleted_data.user2Id },
        //     ],
        //   },
        //   order: [
        //     ['id','DESC']
        //   ],
        // });

        // var lastMessageId = 0;

        // if(findChat){
        //   lastMessageId = findChat.id;
        // }else{
        //  lastMessageId = 0;
        // }

        // if(findChatConstant.userid == deleted_data.userid){

        //   var updateChatConstant = await constant.update({
        //     userLastMsgId: lastMessageId,
        //   },{ 
        //     where: {
        //       [Op.or]: [
        //         { userid: deleted_data.userid, user2Id: deleted_data.user2Id },
        //         { user2Id: deleted_data.userid, userid: deleted_data.user2Id }
        //       ]
        //     }
        //   });

        // }else{

        //   var updateChatConstant = await constant.update({
        //     user2LastMsgId: lastMessageId,
        //   },{ 
        //     where: {
        //       [Op.or]: [
        //         { userid: deleted_data.userid, user2Id: deleted_data.user2Id },
        //         { user2Id: deleted_data.userid, userid: deleted_data.user2Id }
        //       ]
        //     }
        //   });

        // }

        success_message = []
        success_message = {
          'success_message': 'Message deleted Successfully'
        }
        socket.emit('delete_messages', success_message);

      } catch (error) {
        throw error
      }
    });



    socket.on('get_typing_list', async function (data) {
      try {
        if (data) {
          let message = "";
          var get_list2 = await fun.get_typing_list(data);
          get_id = await onlineUser.findOne({
            where: {
              userid: data.user2Id
            }

          })
          if (get_id) {
            var get_list = await fun.get_chat_list(data);
            io.to(get_id.socketId).emit('get_list', get_list);
          }
          if (data.status == 0) {
            message = "typing off";
          } else {
            message = "typing on";
          }
          socket.emit('typing_listener', message);
        }
      } catch (error) {
        console.log(error, "========error=========");
      }

    });

    socket.on('clear_chat', async function (clear_chat) {

      try {

        let clear_chat_data = await fun.clear_chat(clear_chat)
        success_message = []
        success_message = {
          'success_message': 'Chat Clear Successfully'
        }
        socket.emit('clear_data', success_message);

      } catch (error) {
        throw error
      }
    });

    // socket.on('delete_chat', async function (delete_chat) {
    //   try {

    //     //  let delete_chat_data = await fun.delete_msg(delete_chat)
    //     var user_data = await constant.findOne({
    //       where: {
    //         [Op.or]: [
    //           { userid: delete_chat.userid, user2Id: delete_chat.user2Id },
    //           { user2Id: delete_chat.userid, userid: delete_chat.user2Id }

    //         ]
    //       }
    //     });
    //     //  console.log(user_data);
    //     //  return;
    //     if (user_data) {
    //       chat.destroy({
    //         where: {
    //           constantid: user_data.dataValues.id,
    //         }
    //       });

    //       constant.destroy({
    //         where: {
    //           id: user_data.dataValues.id,
    //         }
    //       })


    //       //console.log(user_data.dataValues.id,"ankkkkkkkkkkkkkkkkur");
    //     }
    //     success_message = []
    //     success_message = {
    //       'success_message': 'Chat Deleted Successfully'
    //     }

    //     socket.emit('deleteChat', success_message);

    //   } catch (error) {
    //     throw error
    //   }
    // });

    socket.on('disconnect', async function () {

      let socket_id = socket.id
      let socket_disconnect = await fun.socket_disconnect(socket_id)

      console.log('socket user disconnected');
    });

    socket.on('read_unread', async function (get_read_status) {

      let get_read_unread = await fun.get_read_unread_status(get_read_status);
      get_read_unread = {}
      get_read_unread.read_status = 1
      socket.emit('read_data_status', get_read_unread)

    });

    socket.on('block_user', async function (delete_chat) {
      try {

        let blockUnblock_user = await fun.blockUnblock_user(delete_chat)
        let find_user = await users.findOne({
          where: {
            id: delete_chat.userid
          },
          raw: true
        });

        console.log(find_user);
        success_message = []
        if (delete_chat.type == 1) {
          success_message = find_user.full_name + ' Blocked you'
        }
        else if (delete_chat.type == 0) {
          success_message = find_user.full_name + ' Unblock you'
        }
        data = {
          success_message: success_message,
          userid: delete_chat.userid,
          blockStatus: delete_chat.type
        }
        var get_id = await onlineUser.findOne({
          where: {
            userid: delete_chat.user2Id
          }
        });
        console.log(get_id, "===socketId======socketId========socketId");
        socket.emit('blockUser', data);
        io.to(get_id.socketId).emit('blockUser', data);

      } catch (error) {
        throw error
      }
    });

    socket.on('block_user_details', async function (delete_chat) {
      try {

        var userbys= delete_chat.userid;
        console.log( delete_chat.userid,"ankuruuuuuuuuuuuur");
        var usertos=delete_chat.otherUserId;
        var get_message = await db.blockedUsers.findAll({
          attributes: {
            include: [
               
              [sequelize.literal(`(SELECT count(*) FROM blockedUsers WHERE  blockedUsers.userby=${userbys}  AND blockedUsers.userto = ${usertos} AND blockedUsers.status=1 )`), 'isblockbyme'],
              [sequelize.literal(`(SELECT count(*) FROM blockedUsers WHERE  blockedUsers.userby=${usertos}  AND blockedUsers.userto = ${userbys} AND blockedUsers.status=1 )`), 'isblockbyother'],
             // [sequelize.literal('(SELECT image FROM users WHERE users.id  = chat.userid)'), 'SenderImage'], 
             
       
        ],
        
        },
            // 
            //   [sequelize.literal('(SELECT image FROM users WHERE users.id  = chat.userid)'), 'SenderImage'],
            //    [sequelize.literal('(SELECT name FROM users WHERE users.id  = chat.user2Id)'), 'ReceiverName'],
            //    [sequelize.literal('(SELECT id FROM users WHERE users.id  = chat.user2Id)'), 'ReceiverId'],
                //[sequelize.literal('(SELECT name FROM users WHERE users.id  = chat.user2Id)'), 'ReceiverImage'], 'msgType', 'createdAt','updatedAt'],
          order: [
            ['id', 'ASC'],
          ],
          
          where: {
            [Op.or]: [
              { userby: delete_chat.userid, userto: delete_chat.otherUserId },
              { userby: delete_chat.otherUserId, userto: delete_chat.userid, }
            ]
          }
        });
        console.log(get_message);
       // let blockUnblock_user = await fun.blockUnblock_user(delete_chat)
        // let find_user = await users.findOne({
        //   where: {
        //     id: delete_chat.userid
        //   },
        //   raw: true
        // });

        // console.log(find_user);
        // success_message = []
        // if (delete_chat.type == 1) {
        //   success_message = find_user.full_name + ' Blocked you'
        // }
        // else if (delete_chat.type == 0) {
        //   success_message = find_user.full_name + ' Unblock you'
        // }
        // data = {
        //   success_message: success_message,
        //   userid: delete_chat.userid,
        //   blockStatus: delete_chat.type
        // }
         var get_id = await onlineUser.findOne({
           where: {
             userid:userbys
           },
         });
        // console.log(get_id, "===socketId======socketId========socketId");

        socket.emit('blockUserdetails', get_message);
        io.to(get_id.socketId).emit('blockUserdetails', get_message);

      } catch (error) {
        throw error
      }
    });


    socket.on('report_user', async function (delete_chat) {
      try {

        let report_user = await fun.report_user(delete_chat)

        let find_user = await users.findOne({
          where: {
            id: delete_chat.userid
          },
          raw: true
        });
        success_message = []
        if (!report_user) {
          success_message = find_user.full_name + ' Reported you'
        } else {
          success_message = "All Ready Repoted"
        }
        data = {
          success_message: success_message,
          userid: delete_chat.userid
        }
        var get_id = await onlineUser.findOne({
          where: {
            userid: delete_chat.userid
          }
        });
        console.log(get_id, "===socketId======socketId========socketId");
        socket.emit('report_data', data);
        io.to(get_id.socketId).emit('report_data', data);

      } catch (error) {
        throw error
      }
    });

    
    socket.on("mute_notification", async (get_data) => {
      try {
        let notification_status = await users.findOne({
          attributes:[`id`,`notificationStatus`],
          where:{
            id:get_data.userid
          },
          raw:true
        })

        if(get_data.status==1){
          success_message ="Mute Notification"
        }else{
          success_message="Unmute Notification"
        }
        await users.update({
          notificationStatus:get_data.status
        },{
          where:{
            id:get_data.userid
          }
        });

        socket.emit('muteNotification', {success_message})
      } catch (error) {
        console.log()
      }
    })



    socket.on('update_user_location', async function (location_data) {
      try {

        let update_user_location = await fun.update_user_location(location_data)
        success_message = []
        if (update_user_location) {
          success_message = {
            'success_message': 'Location updated Successfully'
          }
        }
        else {
          success_message = {
            'success_message': 'User not available'
          }
        }
        socket.emit('location_data', success_message);

      } catch (error) {
        throw error
      }
    });

    socket.on('like_user', async function (like_data) {
      try {

        let like_user = await fun.like_user(like_data)
        success_message = []
        if (like_data.type == 1) {
          success_message = {
            'success_message': 'Like Successfully'
          }
        }
        else {
          success_message = {
            'success_message': 'UnLike Successfully'
          }
        }
        socket.emit('like_data', success_message);

      } catch (error) {
        throw error
      }
    });

    socket.on('accept_reject', async function (data_connect) {
      try {

        let accept_reject = await fun.accept_reject(data_connect)
        success_message = []
        if (data_connect.type == 1) {
          success_message = {
            'success_message': 'Accept Successfully'
          }
        }
        else {
          success_message = {
            'success_message': 'Reject Successfully'
          }
        }
        socket.emit('data_connect', success_message);

      } catch (error) {
        throw error
      }
    });

    socket.on('sent_request', async function (request_data) {
      try {

        let sent_request = await fun.sent_request(request_data)
        success_message = []
        success_message = {
          'success_message': 'Request send Successfully'
        }


        socket.emit('request_data', success_message);

      } catch (error) {
        throw error
      }
    });
  });


}