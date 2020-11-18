const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    customer: {
        type: Schema.Types.ObjectId,
    },
    books: [
        {
            type: Schema.Types.ObjectId,
        }
    ],

}, { timestamps: true });



module.exports = mongoose.model('orders', orderSchema);