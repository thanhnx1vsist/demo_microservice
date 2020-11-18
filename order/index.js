const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')

const Service = require("./service")

const app = express();

const db = "mongodb://localhost/microservice_order";
const PORT = 5000;

mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(console.log('Database is connected !!!'));



app.use(bodyParser.json());
app.use('/order', Service);

app.listen(PORT, () => { console.log(`Server is running on port ${PORT}`) });







