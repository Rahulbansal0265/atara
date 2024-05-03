const db = require("../models");
const helper = require("../helpers/helper");
const categories = db.categories;
const subcategories = db.subcategories;
const orders = db.orders;
const users = db.users;
const order_details=db.order_details;
const transactionss=db.transactions;

orders.belongsTo(users, { foreignKey: 'user_id' });
orders.hasOne(order_details, { foreignKey: 'order_id' });

orders.hasOne(transactionss, { foreignKey: 'orderId' });


module.exports={
   
    
    deleteorder: async (req, res) => {
console.log(req.body.id);
        const data = await db.orders.destroy({
            where: {
                id: req.body.id
            }
        })
        res.send('1')

    },

    vieworder:async(req,res)=>{
        if(!req.session.user)return res.redirect("/admin")


        const orders =await db.orders.findOne({
            where:{id:req.params.id},
           include: [{
                model: db.order_details,
               
            },{
                model:db.users,
            },{
                model:db.transactions
            }],
            raw:true,
            nest:true
            
        },
        )
        console.log("-------------------useras",users);
        res.render("orders/vieworder",{orders,session:req.session.user,msg: req.flash('msg'),title:"vieworder"})
        
    }
}
