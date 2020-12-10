const express = require('express');
const router = express.Router();
const Order = require('./orderModel');
const axios = require('axios');
const apiGateway = require('../gateway.json');
const amqp = require('amqplib/callback_api');

router.get('/:id', async (req, res) => {
    // try {
    let orderMongoose = await Order.findOne({ _id: req.params.id });
    let order = orderMongoose.toObject();
    if (order) {


        // get infor about book
        let detailBook = [];
        for (i in order.books) {

            const book = await axios({
                method: 'get',
                url: `http://localhost:3000/book/${order.books[i]}`,
                // url: apiGateway.services.book.url + `${order.books[i]}`,
            })
            detailBook.push(book.data);
        }
        order.detailBook = detailBook;
        amqp.connect('amqp://localhost', (connError, connection) => {
            if (connError) {
                throw connError;
            }
            console.log('connected');
            //Step 2: Create  Channel
            connection.createChannel((channelError, channel) => {

                if (channelError)
                    throw channelError;

                // Step 3: Assert Queue


                const QUEUE_IN_CUSTOMER = 'order to customer';
                const QUEUE_OUT_CUSTOMER = 'customer to order';
                let messToCustomer = {
                    "id": order.customer,
                }



                channel.assertQueue(QUEUE_IN_CUSTOMER);
                channel.assertQueue(QUEUE_OUT_CUSTOMER);

                // Step 4: Send message to queue

                channel.sendToQueue(QUEUE_IN_CUSTOMER, Buffer.from(JSON.stringify(messToCustomer)));
                channel.consume(QUEUE_OUT_CUSTOMER, (msg) => {
                    channel.ack(msg);
                    console.log('aaaaaa', JSON.parse(msg.content));
                    customer = JSON.parse(msg.content);
                    order.detailCustomer = JSON.parse(msg.content);
                    console.log('ooo', order);
                    res.status(200).json(order);
                });



            })


        })



        // order.customerDetail = customer.data;
        // order.detailBook = detailBook;


    }
    // res.status(200).json(order);
    // } catch (error) {
    //     res.status(400).json(error);
    // }
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
