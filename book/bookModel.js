const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Book = new Schema({
    // title, author, price, 

    title: {
        type: String,
        require: true,
    },
    author: {
        type: String,
    },
    price: {
        type: Number,
    },

}, { timestamps: true });

module.exports = mongoose.model('books', Book)