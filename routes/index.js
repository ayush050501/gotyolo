const express = require('express');
const db = require('../models');

const router = express.Router();

router.get('/test', async (req, res) => {
    const data = await db.demo_table.findAll();
    console.log(data);
    res.json({ message: 'Hello World!' });
});

router.get('/trips', async (req, res) => {
    const {
        destination,
        min_rice,
        max_rice,
        start_date,
        category,
        sort_by,
        sort_order,
    } = req.query;
    res.json({ message: 'Hello World!' });
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
