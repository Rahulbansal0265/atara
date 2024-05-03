const models = require('../models');
// const api_helper = require('../helper');
const users = models.users;
const jsonData = require('../jsonData');
const jwt = require('jsonwebtoken'); 

// module.exports = async  (req, res, next) => {
//     try {
//     const authorization = req.headers.authorization.replace("Bearer", "").trim();
//     const user = await users.findOne({
//         where:{
//             token:authorization
//         }
//     }) 
//     console.log(user,"p-----------------user----")
    
//     if (!user) {
        
//         return jsonData.unauth_status(res, "Session Expired.")
//     }
//     req.user = user;
//     next();
//     } catch(err){
//         return jsonData.false_status(res,err.message)
//     }
// }

module.exports = async (req, res, next) => {
    try {
        const authorization = req.headers.authorization;

        if (!authorization || !authorization.startsWith('Bearer')) {
            return jsonData.unauth_status(res, 'Auth token is required.');
        }

        const token = authorization.replace('Bearer', '').trim();
        const user = await users.findOne({
            where: {
                token: token
            }
        });

        if (!user) {
            return jsonData.unauth_status(res, 'Session Expired.');
        }

        req.user = user;
        next();
    } catch (err) {
        return jsonData.false_status(res, err.message);
    }
};
