const mongoose = require("mongoose");

const NFTSchema = new mongoose.Schema({
  owner: String,
  traits: Object,
  finalized: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("NFT", NFTSchema);
