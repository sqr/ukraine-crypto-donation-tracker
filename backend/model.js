const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let btc = new Schema(
  {
    address: {
      type: String,
    },
    amount_btc: {
      type: Number,
    },
    funded_txo_count: {
      type: Number,
    },
  },
  { collection: "btc", timestamps: true }
);
let eth = new Schema(
  {
    address: {
      type: String,
    },
    amount_eth: {
      type: Number,
    },
  },
  { collection: "eth", timestamps: true }
);

const btcSchema = mongoose.model("btc", btc);
const ethSchema = mongoose.model("eth", eth);

module.exports = { Btc: btcSchema, Eth: ethSchema };
