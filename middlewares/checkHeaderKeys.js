
var aes256 = require('aes256');
const { publish_key } = require('../config/constants');
const Helper = require('../helpers/helper');


// live secret_key_encryptedSkBuffer = sk_XW4ZOoiiuLH7H8A0UpBK0k9mRCCJldhiHBWdYXfinngJIdGtyWerPuLWlL+7
// live publish_key_encryptedPkBuffer =pk_Tno5x8x3OhLdnvJxWKDgPxUOjnX77TPoO/P1mheNLG+Ip4EDkD6Q2hPfm4wyyw==


module.exports = {
   

    authenticateHeader: async function (req, res, next) {
        
        try {
            const required = {
                secret_key: req.headers.secret_key,
                publish_key:req.headers.publish_key,
            }; 
            const non_required = {};
            let requestdata = await Helper.vaildObjectApi(required, non_required, res); 
       
            if((req.headers.secret_key !== 'sk_XW4ZOoiiuLH7H8A0UpBK0k9mRCCJldhiHBWdYXfinngJIdGtyWerPuLWlL+7') || (req.headers.publish_key !== 'pk_Tno5x8x3OhLdnvJxWKDgPxUOjnX77TPoO/P1mheNLG+Ip4EDkD6Q2hPfm4wyyw==')){
                return Helper.failed(res,'Key not matched!')
    
    
            }
            next();

        } catch (error) {
            console.log(error,'================error=================')
            return Helper.error(res, error);

            
        }
    }

    
}