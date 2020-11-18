const express = require('express');
const router = express.Router();
const Order = require('./orderModel');
const axios = require('axios');


router.get('/:id', async (req, res) => {
    try {
        let orderMongoose = await Order.findOne({ _id: req.params.id });
        let order = orderMongoose.toObject();
        if (order) {

            // get infor about customer
            let customer = await axios({
                method: 'get',
                url: `http://localhost:4000/customer/${order.customer}`,
            })

            // get infor about book
            let detailBook = [];
            for (i in order.books) {

                const book = await axios({
                    method: 'get',
                    url: `http://localhost:3000/book/${order.books[i]}`,
                })
                detailBook.push(book.data);
            }

            order.customerDetail = customer.data;
            order.detailBook = detailBook;


        }
        res.status(200).json(order);
    } catch (error) {
        res.status(400).json(error);
    }
});


router.post('/', async (req, res) => {
    try {
        const data = req.body;

        const newOrder = new Order({
            customer: data.customer,
            books: data.books,
        })
        const saveOrder = await newOrder.save();
        res.status(200).json(saveOrder);
    } catch (error) {
        res.status(400).json(error);
    }
})

module.exports = router;
