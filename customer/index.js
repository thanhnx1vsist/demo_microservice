const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const cors = require('cors');
const Customer = require('./customerModel');
//const cors = require('cors');

const amqp = require('amqplib/callback_api');
const Service = require("./service")

const app = express();

const db = "mongodb://localhost/microservice_customer";
const PORT = 4000;

mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(console.log('Database is connected !!!'));



app.use(bodyParser.json());
app.use(cors());
amqp.connect('amqp://localhost', (error0, connection) => {
    if (error0) {
        throw error0;
    }
    connection.createChannel((error1, chanel) => {
        if (error1) {
            throw error1;
        }
        const QUEUE_IN_CUSTOMER = 'order to customer';
        const QUEUE_OUT_CUSTOMER = 'customer to order';

        chanel.assertQueue(QUEUE_IN_CUSTOMER, {
            durable: true
        });
        chanel.assertQueue(QUEUE_OUT_CUSTOMER, {
            durable: true,
        });

        chanel.consume(QUEUE_IN_CUSTOMER, async (msg) => {

            chanel.ack(msg);
            const mess = JSON.parse(msg.content);
            console.log('mess', mess);
            let customer = await Customer.findById(mess.id);
            console.log('resss', customer);
            chanel.sendToQueue(QUEUE_OUT_CUSTOMER, Buffer.from(JSON.stringify(customer)));


        })

    })
});
app.use('/customer', Service);

app.listen(PORT, () => { console.log(`Server Customer is running on port ${PORT}`) });







