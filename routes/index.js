const express = require('express');
const {
    getAllTrips, getTripById, createTrip, bookTrip
} = require('../services');

const router = express.Router();

router.get('/test', async (req, res) => {
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
    }
    return res.status(400).json(data);
});

router.get('/trips/:id', async (req, res) => {
    const { id } = req.params;
    const data = await getTripById(id);
    if (data.success) {
        return res.status(200).json(data);
    }
    return res.status(400).json(data);
});

router.post('/trips', async (req, res) => {
    const params = req.body;
    console.log(params);
    const data = await createTrip(params);
    if (data.success) {
        return res.status(200).json(data);
    }
    return res.status(400).json(data);
});

router.post('/trips/:id/book', async (req, res) => {
    const { id } = req.params;
    const bookInfo = req.body;
    const data = await bookTrip(id, bookInfo);
    if (data.success) {
        return res.status(200).json(data);
    }
    return res.status(400).json(data);
});

module.exports = router;
