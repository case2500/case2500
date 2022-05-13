const mongoose = require('mongoose');
const { nominalTypeHack } = require('prop-types');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        // required: [true, 'Please enter product name'],
        trim: true,
        maxLength: [100, 'Product name cannot exceed 100 characters']
    },
    price: {
        type: Number,
        // required: [true, 'Please enter product price'],
        maxLength: [5, 'Product name cannot exceed 5 characters'],
        default: 0.0
    },
    // description: {
    //     type: String,
    //     required: [true, 'Please enter product description'],
    // },
    ratings: {
        type: Number,
        default: 0
    },
    image: {
        type: String,
        default: 'nopic.png'
      },
    category: {
        type: String
  
    },
    stock: {
        type: Number,
        // required: [true, 'Please enter product stock'],
        maxLength: [5, 'Product name cannot exceed 5 characters'],
        default: 0
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Product', productSchema);