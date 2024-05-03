const db = require('../../models');
const sequelize = require('sequelize');
const Op = sequelize.Op;
var users = db.users;
var chat = db.chat;
var like = db.likes;
var constant = db.constant;
var onlineUser = db.onlineUser;


const database = require('../../db/db');
var connections = db.connections
var notifications = db.notifications;
var path = require('path');
var uuid = require('uuid');
const fs = require('fs');

//const fun2 =require('./function/fun.js');
//const functions =require('./function/function.js');
// const functions = require('./function/api_fun.js');
module.exports = {

  create_time_stamp: async function () {

    let current_time = Math.round(new Date().getTime() / 1000)

    return current_time;
  },

  data_to_send: async function (get_data) {
    final_array = [];
    final_array = {
      senderId: get_data.senderId,
      receiverId: get_data.receiverId,
      messageType: get_data.messageType,
      message: get_data.message,
      senderName: get_data.senderName,
      senderProfileImage: get_data.senderProfileImage,
      receiverName: get_data.receiverName,
      RecieverProfileImage: get_data.RecieverProfileImage,
      created: await this.create_time_stamp(),

    }
    return final_array;

  },

  GetChat: async function (msg) {

    // if (msg.productId != "") {
    //   var constant_check = await constant.findOne({
    //     where: {
    //       [Op.or]: [
    //         { userid: msg.userid, user2Id: msg.user2Id, product_id: msg.productId },
    //         { userid: msg.user2Id, user2Id: msg.userid, product_id: msg.productId }
    //       ]
    //     }
    //   });
    //   else {
    var constant_check = await constant.findOne({
      where: {
        [Op.or]: [
          { userid: msg.userid, user2Id: msg.user2Id },
          { userid: msg.user2Id, user2Id: msg.userid }
        ]
      }
    });
    // }
    // console.log(constant_check);

    if (constant_check) {
      constant_check = constant_check.toJSON();
      var get_message = await chat.findAll({
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
        // 
        //   [sequelize.literal('(SELECT image FROM users WHERE users.id  = chat.userid)'), 'SenderImage'],
        //    [sequelize.literal('(SELECT name FROM users WHERE users.id  = chat.user2Id)'), 'ReceiverName'],
        //    [sequelize.literal('(SELECT id FROM users WHERE users.id  = chat.user2Id)'), 'ReceiverId'],
        //[sequelize.literal('(SELECT name FROM users WHERE users.id  = chat.user2Id)'), 'ReceiverImage'], 'msgType', 'createdAt','updatedAt'],
        order: [
          ['id', 'ASC'],
        ],
        where: {
          constantId: constant_check.id,
          deletedId: {
            [Op.ne]: msg.userid
          }
        }
      });

      var blockStatus = await blockedUser.count({
        where: {
          [Op.or]: [
            { userby: msg.userid, userto: msg.user2Id },
            { userto: msg.userid, userby: msg.user2Id }
          ]
        }
      });

      var block_id = 0;
      if (blockStatus == 1) {
        var blockByUser = await blockedUser.findOne({
          where: {
            [Op.or]: [
              { userby: msg.userid, userto: msg.user2Id },
              { userby: msg.user2Id, userto: msg.userid }
            ]
          },
          raw: true,
        });
        block_id = blockByUser.userby;
      } else {
        block_id = 0;
      }
      // console.log(blockStatus);

      let update_read_status = await chat.update({
        readStatus: 1
      },
        {
          where: {
            userid: msg.user2Id
          }
        });

      if (get_message) {
        get_message = get_message.map(val => {
          var data = val.toJSON();
          data.blockStatus = blockStatus;
          data.block_id = block_id;
          return data;
        });

        var result = {
          //blockStatus: blockStatus,
          //block_id: block_id,
          get_message: get_message,
        }
        return get_message;
      }
    } else {
      return []
    }
  },
  // userImage
  get_chat_list: async function (get_chat_data) {
    try {
      //   var get_message = await database.query(`select *,(select Count(*) from chat where (user2id=${get_chat_data.userid} and userid=user_id) and (read_status=0) ) as unreadcount,(SELECT case when count(*) =0 then 0 else 1 end as blockstatus  FROM blockedUsers WHERE((userby= ${get_chat_data.userid} and userto=user_id) or (userby=user_id and userto= ${get_chat_data.userid})) and (status=1)) as blockstatus,(SELECT case when count(*) =0 then 0 else 1 end as followunfollowstatus  FROM follows where ((user_id= ${get_chat_data.userid} and user2id=user_id) or (user_id=user_id and user2id= ${get_chat_data.userid})) and (status=2))  as followunfollowstatus  from (SELECT *,CASE WHEN userid = ${get_chat_data.userid} THEN user2id WHEN user2id = ${get_chat_data.userid} THEN userid  END AS user_id,(select id from chat where deleted_id!=${get_chat_data.userid} and ((userid=${get_chat_data.userid} and user2id=user_id) or (userid=user_id and user2id=${get_chat_data.userid})) order by id desc limit 1 ) as NewLastMsgId,(SELECT message FROM chat where id=NewLastMsgId and deleted_id!=${get_chat_data.userid}) as lastMessage ,(SELECT full_name FROM users where id=user_id) as userName,(SELECT status FROM online_user where userid=user_id) as onlinestatus,(select if(image='','',concat('http://202.164.42.227:2051/images/users/',image)) from users where id = user_id) as userImage, (SELECT  created_at  FROM chat where id=NewLastMsgId) as created_att ,(SELECT  msg_type  FROM chat where id=NewLastMsgId)  as msg_type from constant where (userid=${get_chat_data.userid} or user2id=${get_chat_data.userid}) ORDER BY updated_at DESC) tt where deleted_id!=${get_chat_data.userid}`,
      // {
      //       model: chat,
      //       model: constant,
      //       mapToModel: true,
      //       type: database.QueryTypes.SELECT
      //     })
      console.log(get_chat_data, "==========================mydata");
      var get_message = await database.query(`SELECT *, (CASE WHEN userid = 
        ${get_chat_data.userid} THEN user2id WHEN user2id = ${get_chat_data.userid} THEN 
        userid  END) AS user_id, (select Count(*) from chat 
        where user2id=${get_chat_data.userid} and userid=user_id and read_status=0 ) as 
        unreadcount, (SELECT COUNT(*)  FROM blockedUsers WHERE((userby= ${get_chat_data.userid} and 
          userto=user_id) or (userby=user_id and userto= ${get_chat_data.userid})) and (status=1)) as blockstatus, (select id from chat where deleted_id!=1 and ((userid=${get_chat_data.userid} and user2id=user_id) or 
        (userid=user_id and user2id=${get_chat_data.userid})) order by id desc limit 1 ) as NewLastMsgId, (SELECT message FROM chat where id=NewLastMsgId and deleted_id!=1 ) as lastMessage, (SELECT full_name FROM users where id=user_id) as userName, (SELECT full_name FROM users where id=userid) as senderName,(SELECT lastname FROM users where id=userid) as senderlastname,(SELECT name FROM products where id=product_id) as productname, (SELECT status FROM online_user where userid=user_id) as onlinestatus, (select if(image='','',concat('http://202.164.42.227:8048/images/',image)) from users where id = user_id) as userImage,(select if(image='','',concat('http://202.164.42.227:8048/images/',image)) from users where id = userid) as 
        senderImage,(SELECT  created_at  FROM chat where id=NewLastMsgId) as created_att, (SELECT  msg_type  FROM chat where id=NewLastMsgId)  as msg_type from constant where userid=${get_chat_data.userid}  or user2id=${get_chat_data.userid} `, {
        model: chat,
        model: constant,
        mapToModel: true,
        type: database.QueryTypes.SELECT
      })
      console.log(get_message, "==============get_message=======");
      return get_message;
    }
    catch (err) {
      console.log(err)
    }
  },


  get_typing_list: async function (msg) {

    let cconstant_msg = await constant.update({
      typing: msg.status
    },
      {
        where: {
          [Op.or]: [
            { userid: msg.userid, user2Id: msg.user2Id },
            { userid: msg.user2Id, user2Id: msg.userid }
          ]
        }
      })
    return cconstant_msg
  },

  clear_chat: async function (msg) {
    var find_id = await chat.findAll({
      where: {
        deletedId: 0,
        [Op.or]: [
          { userid: msg.userid, user2Id: msg.user2Id },
          { userid: msg.user2Id, user2Id: msg.userid }
        ]
      }
    })

    if (find_id != "") {
      var clear_msg = await chat.update({
        deletedId: msg.userid,
        readStatus: 1
      },
        {
          where: {
            [Op.or]: [
              { userid: msg.userid, user2Id: msg.user2Id },
              { userid: msg.user2Id, user2Id: msg.userid }
            ]
          }
        })
      // clear_msg = await chat.update({
      //   message: ''
      // },
      //   {
      //     where: {
      //       [Op.or]: [
      //         { userid: msg.userid, user2Id: msg.user2Id },
      //         { userid: msg.user2Id, user2Id: msg.userid }
      //       ]
      //     }
      //   })
    }
    else {
      let clear_msg = await chat.destroy({
        where: {
          [Op.or]: [
            { userid: msg.userid, user2Id: msg.user2Id },
            { userid: msg.user2Id, user2Id: msg.userid }
          ]
        }
      })
      clear_msg = await chat.update({
        message: ''
      },
        {
          where: {
            [Op.or]: [
              { userid: msg.userid, user2Id: msg.user2Id },
              { userid: msg.user2Id, user2Id: msg.userid }
            ]
          }
        })

    }
    return clear_msg;
  },


  image_base_64: async function (get_message, extension_data) {
    var image = get_message
    var data = image.replace(/^data:image\/\w+;base64,/, '');
    var extension = extension_data;
    var filename = Math.floor(Date.now() / 1000) + '.' + extension;
    var base64Str = data;
    upload_path = path.join(__dirname, '../public/images/' + filename);
    if (extension) {
      fs.writeFile(upload_path, base64Str, {
        encoding: 'base64'
      }, function (err) {
        if (err) {
          console.log(err)
        }
      })
    }

    console.log(filename);
    return filename;
  },

  delete_msg: async function (msg) {
    var find_id = await chat.findAll({
      where: {
        deletedId: 0,
        [Op.or]: [
          { userid: msg.userid, user2Id: msg.user2Id },
          { userid: msg.user2Id, user2Id: msg.userid }
        ]
      }
    })

    if (find_id != 0) {
      //   //  console.log(find_id,"----------------->");
      //   // return;
      var clear_msg = await chat.update({
        deletedId: msg.userid,
        readStatus: 1
      },
        {
          where: {
            [Op.or]: [
              { userid: msg.userid, user2Id: msg.user2Id },
              { userid: msg.user2Id, user2Id: msg.userid }
            ]
          }
        });
      updateconstant = await constant.update({
        delete_id: msg.userid
      },
        {
          where: {
            [Op.or]: [
              { userid: msg.userid, user2Id: msg.user2Id },
              { userid: msg.user2Id, user2Id: msg.userid }
            ]
          }
        })
    }
    else {
      // console.log("ankursharm");
      // return;
      const clear_msg = await chat.destroy({
        where: {
          [Op.or]: [
            { userid: msg.userid, user2Id: msg.user2Id},
            { userid: msg.user2Id, user2Id: msg.userid }
          ]
        }
      });
      updateconstant = await constant.destroy({
        where: {
          [Op.or]: [
            { userid: msg.userid, user2Id: msg.user2Id},
            { userid: msg.user2Id, user2Id: msg.userid}
          ]
        }
      });

    }
    return updateconstant;

  },

  socket_disconnect: async function (socket_id) {
    /* console.log(socket_id,"socket_id") */
    let disconnect_socket_user = await onlineUser.update({
      status: 0,
      // updated: await this.create_time_stamp()
    },
      {
        where: {
          socketId: socket_id
        }
      }
    );
    return disconnect_socket_user
  },

  get_read_unread_status: async function (get_read_status) {

    update_read_status = await chat.update({
      readStatus: 1
    },
      {
        where: {
          userid: get_read_status.user2Id,
          user2Id: get_read_status.userid
        }
      }
    );
    return update_read_status;
  },

  blockUnblock_user: async function (type) {
    if (type.type == 1) {
      let find_block = await blockedUser.findOne({
        where: {
          userby: type.userid,
          userto: type.user2Id,
        }
      })
      if (find_block) {
        return find_block
      }
      else {
        update_read_status = await blockedUser.create({
          userby: type.userid,
          userto: type.user2Id,
          status: 1
        });

        return update_read_status;
      }

    }
    else if (type.type == 0) {
      update_read_status = await blockedUser.destroy({
        where: {
          userby: type.userid,
          userto: type.user2Id,
        }
      });

      return update_read_status;
    }
  },


 


  update_user_location: async function (type) {
    let find_data = await users.findOne({
      where: {
        id: type.userid
      }
    })
    if (find_data) {
      let update_loc = await users.update({
        lat: type.lat,
        lng: type.lng,
      },
        {
          where: {
            id: type.userid
          }
        }
      );
    }
    return find_data
  },

  like_user: async function (type) {
    if (type.type == 1) {
      find_user = await like.findOne({
        where: {
          userby: type.userid,
          userto: type.user2Id
        }
      })
      if (find_user) {
        return find_user
      }
      else {
        data = await like.create({
          userby: type.userid,
          userto: type.user2Id
        });
        let find_userdata = await users.findOne({
          where: {
            id: type.userid
          }
        })
        let get_user_details = await users.findOne({
          where: {
            id: type.user2Id
          }
        })
        like_notification = await notifications.create({
          senderid: type.userid,
          receiverid: type.user2Id,
          type: 1,
          message: find_userdata.dataValues.first_name + " likes your profile",
        });
        if (get_user_details.dataValues.notificationStatus == 1) {
          device_token = get_user_details.dataValues.deviceToken
          device_type = get_user_details.dataValues.deviceType
          userid = find_userdata.dataValues.id
          username = find_userdata.dataValues.first_name

          message = find_userdata.dataValues.first_name + " likes your profile"
          push_type = 1 //for like
          // console.log(device_token,"adededed");
          let send_push_notification = await my_function.send_push_notification_normal(message, device_token, device_type, push_type, userid, username)
          console.log(send_push_notification, "adededed");
        }
      }


    } else {
      data = await like.destroy({
        where: {
          userby: type.userid,
          userto: type.user2Id
        }
      });
    }
    return data
  },

  accept_reject: async function (type) {

    if (type.type == 1) {
      data = await connections.update({
        status: 1
      }, {
        where: {
          userby: type.user2Id,
          userto: type.userid,
        }

      });
      data_data = await connections.update({
        status: 1
      }, {
        where: {
          userby: type.userid,
          userto: type.user2Id,
        }

      });
      let find_userdata = await users.findOne({
        where: {
          id: type.userid
        }
      })
      let get_user_details = await users.findOne({
        where: {
          id: type.user2Id
        }
      })
      like_notification = await notifications.destroy({
        where: {
          senderid: type.user2Id,
          receiverid: type.userid,
          type: 2
        }
      });
      like_notifications = await notifications.create({
        senderid: type.userid,
        receiverid: type.user2Id,
        type: 3,
        message: find_userdata.dataValues.first_name + " accepted your chat request",
      });
      if (get_user_details.dataValues.notificationStatus == 1) {
        device_token = get_user_details.dataValues.deviceToken
        device_type = get_user_details.dataValues.deviceType
        userid = find_userdata.dataValues.id
        username = find_userdata.dataValues.first_name

        message = find_userdata.dataValues.first_name + " accepted your chat request"
        push_type = 3 //for send request
        // console.log(device_token,"adededed");
        let send_push_notification = await my_function.send_push_notification_normal(message, device_token, device_type, push_type, userid, username)
        console.log(send_push_notification, "adededed");
      }
      let findData = await connections.findOne({
        where: {
          userby: type.userid,
          userto: type.user2Id,
          status: 1
        }
      })
      if (!findData) {
        var cre_data = await connections.create({
          userby: type.userid,
          userto: type.user2Id,
          status: 1
        });
      }


    } else {
      data = await connections.destroy({
        where: {
          userby: type.user2Id,
          userto: type.userid
        }
      });
      let find_userdata = await users.findOne({
        where: {
          id: type.userid
        }
      })
      let get_user_details = await users.findOne({
        where: {
          id: type.user2Id
        }
      })
      like_notification = await notifications.destroy({
        where: {
          senderid: type.user2Id,
          receiverid: type.userid,
          type: 2,
        }
      });
      like_notifications = await notifications.create({
        senderid: type.userid,
        receiverid: type.user2Id,
        type: 3,
        message: find_userdata.dataValues.first_name + " rejected your request",
      });
      if (get_user_details.dataValues.notificationStatus == 1) {
        device_token = get_user_details.dataValues.deviceToken
        device_type = get_user_details.dataValues.deviceType
        userid = find_userdata.dataValues.id
        username = find_userdata.dataValues.first_name

        message = find_userdata.dataValues.first_name + " rejected your request"
        push_type = 3 //for send request
        // console.log(device_token,"adededed");
        let send_push_notification = await my_function.send_push_notification_normal(message, device_token, device_type, push_type, userid, username)
        console.log(send_push_notification, "adededed");
      }
    }
    return data
  },

  sent_request: async function (type) {

    let findData = await connections.findOne({
      where: {
        userby: type.userid,
        userto: type.user2Id
      }
    })
    if (findData) {
      return findData
    }
    else {
      let update_loc = await connections.create({
        userby: type.userid,
        userto: type.user2Id
      })
      let find_userdata = await users.findOne({
        where: {
          id: type.userid
        }
      })
      let get_user_details = await users.findOne({
        where: {
          id: type.user2Id
        }
      })
      like_notification = await notifications.create({
        senderid: type.userid,
        receiverid: type.user2Id,
        type: 2,
        message: find_userdata.dataValues.first_name + " send you a chat request",
      });
      if (get_user_details.dataValues.notificationStatus == 1) {
        device_token = get_user_details.dataValues.deviceToken
        device_type = get_user_details.dataValues.deviceType
        userid = find_userdata.dataValues.id
        username = find_userdata.dataValues.first_name

        message = find_userdata.dataValues.first_name + " send you a chat request"
        push_type = 2 //for send request
        // console.log(device_token,"adededed");
        let send_push_notification = await my_function.send_push_notification_normal(message, device_token, device_type, push_type, userid, username)
        console.log(send_push_notification, "adededed");
      }
      return update_loc
    }

  },

}