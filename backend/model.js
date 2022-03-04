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
    last_block_checked: {
      type: String,
    },
    last_block_checked_internal: {
      type: String,
    },
    tx_vol_in: {
      type: String,
    },
    tx_vol_in_internal: {
      type: String,
    },
    tx_vol_out: {
      type: String,
    },
    tx_vol_out_internal: {
      type: String,
    },
    tx_count_in: {
      type: Number,
    },
    tx_count_in_interal: {
      type: Number,
    },
    tx_count_out: {
      type: Number,
    },
    tx_count_out_internal: {
      type: Number,
    },
  },
  { collection: "eth", timestamps: true }
);

let btcExchange = new Schema(
  {
    base: {
      type: String,
    },
    quote: {
      type: String,
    },
    rate: {
      type: Number,
    },
  },
  { collection: "rate" }
);
let ethExchange = new Schema(
  {
    base: {
      type: String,
    },
    quote: {
      type: String,
    },
    rate: {
      type: Number,
    },
  },
  { collection: "rate" }
);
let erc20 = new Schema(
  {
    address: {
      type: String,
    },
    last_block_checked: {
      type: String,
    },
    amount: {
      type: String,
    },
    token_name: {
      type: String,
    },
    token_symbol: {
      type: String,
    },
    token_decimals: {
      type: String,
    },
    tx_count_in: {
      type: Number,
    },
  },
  { collection: "erc20", timestamps: true }
);

const btcSchema = mongoose.model("btc", btc);
const ethSchema = mongoose.model("eth", eth);
const erc20Schema = mongoose.model("erc20", erc20);
const btcExchangeSchema = mongoose.model("btcExchange", btcExchange);
const ethExchangeSchema = mongoose.model("ethExchange", ethExchange);

module.exports = {
  Btc: btcSchema,
  Eth: ethSchema,
  Erc20: erc20Schema,
  BtcExchange: btcExchangeSchema,
  EthExchange: ethExchangeSchema,
};
