const express = require('express');
const router = express.Router();
const ethersController = require('../controllers/ethers.controller')

router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.get('/isValidWalletAddress/:address', ethersController.isValidWalletAddress);

router.get('/createWallet', ethersController.createWallet);

router.get('/latestTransactions', ethersController.latestTransactions);


module.exports = router;