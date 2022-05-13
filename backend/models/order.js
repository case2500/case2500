const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter product name'],
        trim: true,
        maxLength: [100, 'Product name cannot exceed 100 characters']
    },
    price: {
        type: Number,
        // required: [true, 'Please enter product price'],
   
        default: 100
    },
  
    qty: {
        type: Number,
        default: 1
    },

    date: {
        type: String,
        required: [true, 'Please enter order date '],
       

    },
    status:{
        type: Number,
        default:0
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Order', orderSchema);