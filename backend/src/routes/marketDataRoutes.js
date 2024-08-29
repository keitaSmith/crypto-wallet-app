const express = require('express');
const { getCryptoPrices } = require('../controllers/marketDataController');
const router = express.Router();

router.get('/ethereum-prices', getCryptoPrices);

module.exports = router;

