const express = require('express');
const db = require('../models');
const { getAllTrips } = require('../services');

const router = express.Router();

router.get('/test', async (req, res) => {
    const data = await db.demo_table.findAll();
    console.log(data);
    res.json({ message: 'Hello World!' });
});

router.get('/trips', async (req, res) => {
    const {
        destination,
        min_price,
        max_price,
        start_date,
        category,
        sort_by,
        sort_order, // ASC OR DESC
    } = req.query;

    console.log(req.query);

    const params = {
        destination,
        min_price,
        max_price,
        start_date,
        category,
        sort_by,
        sort_order,
    };

    const data = await getAllTrips(params);

    if (data.success) {
        return res.status(200).json(data);
    } else {
        return res.status(400).json(data);
    }
});

router.get('/trips/:id', async (req, res) => {
    res.json({ message: 'Hello World!' });
});

router.post('/trips', async (req, res) => {
    const {
        destination,
        min_rice,
        max_rice,
        start_date,
        category,
        sort_by,
        sort_order,
    } = req.body;
    res.json({ message: 'Hello World!' });
});

router.post('/trips/:id/book', async (req, res) => {
    const {
        destination,
        min_rice,
        max_rice,
        start_date,
        category,
        sort_by,
        sort_order,
    } = req.body;
    res.json({ message: 'Hello World!' });
});

module.exports = router;
