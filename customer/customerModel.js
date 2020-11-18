const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const Customer = new Schema({
    name: {
        type: String,
        require: true,
    },
    age: {
        type: Number,
        require: true,
    },

}, { timestamp: true });

module.exports = mongoose.model('customer', Customer);

