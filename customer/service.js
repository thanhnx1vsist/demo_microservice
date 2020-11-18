const Customer = require('./customerModel');
const express = require('express');
const router = express.Router();

router.get('/:id', async (req, res) => {
    try {
        let customer = await Customer.findOne({ _id: req.params.id }).select('name age');
        res.status(200).json(customer);
    } catch (error) {
        res.status(400).json(error)
    }

});

router.post('/', async (req, res) => {
    try {
        const data = req.body;
        const newCustomer = new Customer({
            name: data.name,
            age: data.age,
        });
        const saveCustomer = await newCustomer.save();
        res.status(200).json(saveCustomer);
    } catch (error) {
        res.status(400).json(error);
    }
});

module.exports = router;





