const Wallet = require('../models/Miner.model');

module.exports.create = wallet => {
  return Wallet.create(wallet);
}