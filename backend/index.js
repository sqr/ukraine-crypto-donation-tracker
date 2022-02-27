const express = require("express");
const app = express();
const mongoose = require("mongoose");
const { Btc, Eth } = require("./model");
const { satToBtc, weiToEth } = require("./conversion");

const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: process.env.CORS_ORIGINS.split(", "),
    methods: ["GET", "POST", "OPTIONS"],
    credentials: true,
  })
);

const mongoDB = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PW}@${process.env.MONGO_URL}/ukraine?authSource=admin`;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

db.once("open", function () {
  console.log("MongoDB database connection established successfully");
});
db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.get("/test", (req, res) => {
  res.json({ message: "Welcome to the application on port 3001." });
});

app.post("/btc", async (req, res) => {
  // https://blockstream.info/api/address/357a3So9CbsNfBBgFYACGvxxS6tMaDoa1P
  axios
    .get(
      "https://blockstream.info/api/address/357a3So9CbsNfBBgFYACGvxxS6tMaDoa1P"
    )
    .then((res2) => {
      console.log(res2.data);
      // Convert response amount (in Satoshis) to Btc
      const amount_btc = satToBtc(res2.data.chain_stats.funded_txo_sum);
      const data = {
        address: res2.data.address,
        amount_btc: amount_btc,
        funded_txo_count: res2.data.chain_stats.funded_txo_count,
      };
      Btc.insertMany(data, function (err, result) {
        if (err) {
          res.send(err);
        } else {
          res.send(result);
        }
      });
    })
    .catch((err) => {
      console.log("Error: ", err.message);
    });
});

app.post("/eth", async (req, res) => {
  // https://api.etherscan.io/api?module=account&action=balance&address=0x165CD37b4C644C2921454429E7F9358d18A45e14&tag=latest&apikey=
  const ETHERSCAN_APIKEY = process.env.ETHERSCAN_APIKEY;

  axios
    .get(
      `https://api.etherscan.io/api?module=account&action=balance&address=0x165CD37b4C644C2921454429E7F9358d18A45e14&tag=latest&apikey=${ETHERSCAN_APIKEY}`
    )
    .then((res2) => {
      console.log(res2.data);
      // Convert response amount (in wei) to Eth
      const amount_eth = weiToEth(res2.data.result);
      const data = {
        address: "0x165CD37b4C644C2921454429E7F9358d18A45e14",
        amount_eth: amount_eth,
      };
      Eth.insertMany(data, function (err, result) {
        if (err) {
          res.send(err);
        } else {
          res.send(result);
        }
      });
    })
    .catch((err) => {
      console.log("Error: ", err.message);
    });
});

const server = app.listen(6001, () => {
  const host = server.address().address;
  const port = server.address().port;

  console.log("Listening on %s port %s", host, port);
});
