const Pay = require('../models/pay');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('../config/index');
const { promises } = require('nodemailer/lib/xoauth2');

exports.index = async (req, res, next) => {
    
    const pays = await Pay.find().sort({createdAt: -1});
    res.status(200).json(
        pays
    );
}

// const orderItemsIds = Promise.all(req.body.orderItems.map(async (orderItem) =>{
//     let newOrderItem = new OrderItem({
//         quantity: orderItem.quantity,
//         product: orderItem.product
//     })

//     newOrderItem = await newOrderItem.save();
exports.insert = async (req, res, next) => {
    const { name, price,qty,date } = req.body;
console.log(req.body)
    // let staff = new Staff(req.body);
    let pay = new Pay({
        name: name,
        price: price,
        qty:qty,
        date:date
    });
    await pay.save();

    res.status(201).json({
        message: 'เพิ่มข้อมูลเรียบร้อย'
    });
}


exports.deleteOrder = async (req, res, next) => {
    console.log(req.params)
     try {
        const { id } = req.params;

         await Order.deleteOne({_id: id})
  
            res.status(200).json({
                message: 'ลบข้อมูลเรียบร้อย'
            });
       
    } catch (error) {
        res.status(400).json({
            error: {
                message: 'เกิดผิดพลาด ' + error.message
            } 
        });
    }
}

// exports.add = async (req, res, next) => {
//     console.log(req.body)
//     try {
//         const { name, price, qty,date } = req.body;
//         let order = new Order();
//         order.name = name;
//         order.price = price;
//         order.qty = qty;
//          order.date = date;
 
    
//         await order.save();
    
//         return res.status(201).json({
//             message: 'บึนทึกเรียบร้อย'
//         });  
//     } catch (error) {
//        next(error); 
//     }
// }

