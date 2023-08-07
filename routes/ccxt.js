const express = require('express');
const router = express.Router();
const ccxtController = require('../controllers/ccxt.controller')

router.get('/coins', ccxtController.getTradableCoins);

router.get('/averagePrices', ccxtController.averagePrices);

module.exports = router;