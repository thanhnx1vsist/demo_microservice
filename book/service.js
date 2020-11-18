const Book = require('./bookModel');
const express = require('express');
const router = express.Router();

router.get('/:id', async (req, res) => {
    try {
        let book = await Book.findOne({ _id: req.params.id }).select('title author price');
        res.status(200).json(book);
    } catch (error) {
        res.status(400).json(error)
    }

});

router.post('/', async (req, res) => {
    try {
        const data = req.body;
        const newBook = new Book({
            title: data.title,
            author: data.author,
            price: data.price,
        });
        const saveBook = await newBook.save();
        res.status(200).json(saveBook);
    } catch (error) {
        res.status(400).json(error);
    }
});

module.exports = router;





