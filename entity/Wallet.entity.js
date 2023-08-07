const mongoose = require('mongoose');
const { Schema } = mongoose;
mongoose.Promise = global.Promise;

const walletSchema = new Schema({
  address: {
    type: String,
    unique: true,
    trim: true,
  }
},

{
  timestamps: true,
	versionKey: false
});

module.exports = mongoose.model('Wallet', walletSchema);