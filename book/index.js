const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const cors = require('cors');
const Book = require('./bookModel');

const amqp = require('amqplib/callback_api');
const Service = require("./service")

const app = express();

const db = "mongodb://localhost/microservice_book";
const PORT = 3000;

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
        const QUEUE_IN_BOOK = 'order to book';
        const QUEUE_OUT_BOOK = 'book to order';

        chanel.assertQueue(QUEUE_IN_BOOK, {
            durable: true
        });
        chanel.assertQueue(QUEUE_OUT_BOOK, {
            durable: true,
        });

        chanel.consume(QUEUE_IN_BOOK, async (msg) => {
            let books = [];
            chanel.ack(msg);
            const mess = JSON.parse(msg.content);
            console.log('mess', mess);
            for (let i in mess) {
                let book = await Book.findById(mess[i]);
                books.push(book);
            }
            console.log('resss', books);
            chanel.sendToQueue(QUEUE_OUT_BOOK, Buffer.from(JSON.stringify(books)));


        })

    })
});

app.use('/book', Service);

app.listen(PORT, () => { console.log(`Server Book is running on port ${PORT}`) });







