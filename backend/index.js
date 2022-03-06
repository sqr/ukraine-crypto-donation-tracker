const express = require("express");
const app = express();
const mongoose = require("mongoose");
const { Btc, Eth, Erc20, BtcExchange, EthExchange } = require("./model");
const { satToBtc, weiToEth } = require("./conversion");
const ethereumjs = require("ethereumjs-units");

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
  res.json({ message: "Welcome to the application on port 6001." });
});

app.get("/total", async (req, res) => {
  const totalBtc = await Btc.findOne().sort({ createdAt: -1 });
  const totalEth = await Eth.findOne().sort({ createdAt: -1 });
  const rateBtc = await BtcExchange.findOne({ base: "btc" });
  const rateEth = await EthExchange.findOne({ base: "eth" });
  const usdDonations = {
    btc: totalBtc.amount_btc * rateBtc.rate,
    eth: totalEth.amount_eth * rateEth.rate,
    total:
      totalBtc.amount_btc * rateBtc.rate + totalEth.amount_eth * rateEth.rate,
  };
  res.json(usdDonations);
});

app.get("/btc", async (req, res) => {
  const allBtc = await Btc.find();
  res.json(allBtc);
});

app.get("/eth", async (req, res) => {
  const allEth = await Eth.find();
  res.json(allEth);
});

app.get("/pruebakey", async (req, res) => {
  const { apiKey } = req.query;
  if (apiKey === process.env.BACKEND_KEY) {
    res.json({ message: "Authorized" });
  } else {
    res.sendStatus(401);
  }
});

app.post("/btc", async (req, res) => {
  const { apiKey } = req.query;

  if (apiKey === process.env.BACKEND_KEY) {
    axios
      .get(
        "https://blockstream.info/api/address/357a3So9CbsNfBBgFYACGvxxS6tMaDoa1P"
      )
      .then((res2) => {
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
  } else {
    res.sendStatus(401);
  }
});

app.post("/eth", async (req, res) => {
  const ETHERSCAN_APIKEY = process.env.ETHERSCAN_APIKEY;
  const { apiKey } = req.query;

  if (apiKey === process.env.BACKEND_KEY) {
    const lastEth = await Eth.findOne().sort({ createdAt: -1 });
    const nextBlock = lastEth.last_block_checked
      ? Number(lastEth.last_block_checked) + 1
      : "0";
    const nextBlockInternal = lastEth.last_block_checked_internal
      ? Number(lastEth.last_block_checked_internal) + 1
      : "0";
    axios
      .get(
        `https://api.etherscan.io/api?module=account&action=txlist&address=0x165CD37b4C644C2921454429E7F9358d18A45e14&startblock=${nextBlock}&sort=asc&apikey=${ETHERSCAN_APIKEY}`
      )
      .then((ethres) => {
        console.log(lastEth);
        let dbObject = {
          last_block_checked: BigInt(0),
          last_block_checked_internal: lastEth.last_block_checked_internal
            ? BigInt(lastEth.last_block_checked_internal)
            : BigInt(0),
          tx_vol_in: lastEth.tx_vol_in ? BigInt(lastEth.tx_vol_in) : BigInt(0),
          tx_vol_out: lastEth.tx_vol_out
            ? BigInt(lastEth.tx_vol_out)
            : BigInt(0),
          tx_count_in: lastEth.tx_count_in ? lastEth.tx_count_in : 0,
          tx_count_out: lastEth.tx_count_out ? lastEth.tx_count_out : 0,
          tx_vol_in_internal: lastEth.tx_vol_in_internal
            ? BigInt(lastEth.tx_vol_in_internal)
            : BigInt(0),
          tx_vol_out_internal: lastEth.tx_vol_out_internal
            ? BigInt(lastEth.tx_vol_out_internal)
            : BigInt(0),
          tx_count_in_internal: lastEth.tx_count_in_internal
            ? lastEth.tx_count_in_internal
            : 0,
          tx_count_out_internal: lastEth.tx_count_out_internal
            ? lastEth.tx_count_out_internal
            : 0,
        };
        const data = ethres.data.result;
        for (element of data) {
          if (
            element.to.toLowerCase() ===
            "0x165cd37b4c644c2921454429e7f9358d18a45e14"
          ) {
            dbObject.tx_vol_in += BigInt(element.value);
            dbObject.tx_count_in += 1;
          } else if (
            element.from.toLowerCase() ===
            "0x165cd37b4c644c2921454429e7f9358d18a45e14"
          ) {
            dbObject.tx_vol_out += BigInt(element.value);
            dbObject.tx_count_out += 1;
          }
        }
        dbObject.last_block_checked = Number(data.pop().blockNumber);
        console.log(dbObject);
        return dbObject;
      })
      .then((dbObject) => {
        axios
          .get(
            `https://api.etherscan.io/api?module=account&action=txlistinternal&address=0x165CD37b4C644C2921454429E7F9358d18A45e14&startblock=${nextBlockInternal}&sort=asc&apikey=${ETHERSCAN_APIKEY}`
          )
          .then((ethres) => {
            const data = ethres.data.result;
            if (data.length === 0) {
              return dbObject;
            } else {
              for (element of data) {
                if (
                  element.to.toLowerCase() ===
                  "0x165cd37b4c644c2921454429e7f9358d18a45e14"
                ) {
                  dbObject.tx_vol_in_internal += BigInt(element.value);
                  dbObject.tx_count_in_internal += 1;
                } else if (
                  element.from.toLowerCase() ===
                  "0x165cd37b4c644c2921454429e7f9358d18a45e14"
                ) {
                  dbObject.tx_vol_out_internal += BigInt(element.value);
                  dbObject.tx_count_out_internal += 1;
                }
              }
              dbObject.last_block_checked_internal = Number(
                data.pop().blockNumber
              );
              console.log(dbObject);
              //   BigInt.prototype.toJSON = function () {
              //     return this.toString();
              //   };
              //   res.json(dbObject);
              return dbObject;
            }
          })
          .then((dbObject) => {
            //   const amount_eth = weiToEth(
            //     dbObject.tx_vol_in + dbObject.tx_vol_in_internal
            //   );
            const amount_eth = ethereumjs.convert(
              dbObject.tx_vol_in + dbObject.tx_vol_in_internal,
              "wei",
              "eth"
            );
            BigInt.prototype.toJSON = function () {
              return this.toString();
            };
            const data = {
              address: "0x165CD37b4C644C2921454429E7F9358d18A45e14",
              amount_eth: amount_eth,
              last_block_checked: dbObject.last_block_checked,
              last_block_checked_internal: dbObject.last_block_checked_internal,
              tx_vol_in: dbObject.tx_vol_in,
              tx_vol_out: dbObject.tx_vol_out,
              tx_count_in: dbObject.tx_count_in,
              tx_count_out: dbObject.tx_count_out,
              tx_vol_in_internal: dbObject.tx_vol_in_internal,
              tx_vol_out_internal: dbObject.tx_vol_out_internal,
              tx_count_in_internal: dbObject.tx_count_in_internal,
              tx_count_out_internal: dbObject.tx_count_out_internal,
            };
            Eth.insertMany(data, function (err, result) {
              if (err) {
                res.send(err);
              } else {
                res.send(result);
              }
            });
          });
      })
      .catch((err) => {
        console.log("Error: ", err.message);
      });
  } else {
    res.sendStatus(401);
  }
});

const getNextBlock = async () => {
  try {
    const lastERC20 = await Erc20.findOne().sort({ last_block_checked: -1 });
    const nextBlock = Number(lastERC20?.last_block_checked) + 1 || "0";
    return nextBlock;
  } catch (error) {
    console.error(`Error setting Next Block: ${error}`);
  }
};

app.post("/erc20", async (req, res) => {
  const ETHERSCAN_APIKEY = process.env.ETHERSCAN_APIKEY;
  const { apiKey } = req.query;
  if (apiKey === process.env.BACKEND_KEY) {
    const nextBlock = await getNextBlock();
    try {
      const apires = await axios.get(
        `https://api.etherscan.io/api?module=account&action=tokentx&address=0x165CD37b4C644C2921454429E7F9358d18A45e14&startblock=${nextBlock}&sort=asc&apikey=${ETHERSCAN_APIKEY}`
      );
      let savedTokens = [];
      for (txIndex in apires.data.result) {
        let tx = apires.data.result[txIndex];
        if (tx.to === "0x165cd37b4c644c2921454429e7f9358d18a45e14") {
          let currentToken = savedTokens.find((token, i) => {
            if (token.token_name === tx.tokenName) {
              savedTokens[i] = {
                address: token.address,
                token_name: token.token_name,
                token_symbol: token.token_symbol,
                token_decimals: token.token_decimals,
                amount: (BigInt(token.amount) + BigInt(tx.value)).toString(),
                tx_count_in: token.tx_count_in + 1,
                last_block_checked: tx.blockNumber,
              };
              return true;
            }
          });
          // Add the current amount to already existing object in savedTokens
          if (currentToken === undefined) {
            // If the current transaction's token is NOT  in savedTokens, this is our first transaction of this token
            let {
              blockNumber,
              value,
              tokenName,
              tokenSymbol,
              tokenDecimal,
              to,
            } = tx;
            // Create a new intermediate object with all relevant info (token name, symbol, etc) and push it to savedTokens
            savedTokens.push({
              address: to,
              last_block_checked: blockNumber,
              token_name: tokenName,
              token_symbol: tokenSymbol,
              token_decimals: tokenDecimal,
              amount: value.toString(),
              tx_count_in: 1,
            });
          }
        }
      }
      for (token in savedTokens) {
        const dataForDb = await Erc20.findOne({
          token_symbol: savedTokens[token].token_symbol,
        }).then((dbToken) => {
          if (dbToken) {
            return {
              address: dbToken.address,
              last_block_checked: savedTokens[token].last_block_checked,
              token_name: dbToken.token_name,
              token_symbol: dbToken.token_symbol,
              token_decimals: dbToken.token_decimals,
              amount: (
                BigInt(dbToken.amount) + BigInt(savedTokens[token].amount)
              ).toString(),
              tx_count_in: dbToken.tx_count_in + savedTokens[token].tx_count_in,
            };
          } else {
            return savedTokens[token];
          }
        });
        const filter = { token_symbol: savedTokens[token].token_symbol };
        Erc20.findOneAndUpdate(filter, dataForDb, {
          new: true,
          upsert: true,
        }).then((res3) => {
          //console.log(res3);
        });
      }
      console.log(`${savedTokens.length} ERC20 tokens saved to DB`);
      res.json({ message: `${savedTokens.length} ERC20 tokens saved to DB` });
    } catch (error) {
      console.error(`Error saving ERC20 tokens: ${error}`);
      res.json({ message: `Error saving ERC20 tokens: ${error}` });
    }
  } else {
    res.sendStatus(401);
  }
});

app.post("/btcexchange", async (req, res) => {
  const COINAPI_APIKEY = process.env.COINAPI_APIKEY;
  let config = {
    headers: {
      "X-CoinAPI-Key": COINAPI_APIKEY,
    },
  };
  const { apiKey } = req.query;

  if (apiKey === process.env.BACKEND_KEY) {
    axios
      .get("https://rest.coinapi.io/v1/exchangerate/BTC/USD", config)
      .then((res2) => {
        console.log(res2.data);
        // Store in db
        const filter = { base: "btc", quote: "usd" };
        const update = { rate: res2.data.rate };
        BtcExchange.findOneAndUpdate(filter, update, {
          new: true,
          upsert: true, // Make this update into an upsert
        }).then((res3) => {
          res.send(res3);
        });
      })
      .catch((err) => {
        console.log("Error: ", err.message);
      });
  } else {
    res.sendStatus(401);
  }
});

app.post("/ethexchange", async (req, res) => {
  const COINAPI_APIKEY = process.env.COINAPI_APIKEY;
  let config = {
    headers: {
      "X-CoinAPI-Key": COINAPI_APIKEY,
    },
  };
  const { apiKey } = req.query;

  if (apiKey === process.env.BACKEND_KEY) {
    axios
      .get("https://rest.coinapi.io/v1/exchangerate/ETH/USD", config)
      .then((res2) => {
        console.log(res2.data);
        // Store in db
        const filter = { base: "eth", quote: "usd" };
        const update = { rate: res2.data.rate };
        EthExchange.findOneAndUpdate(filter, update, {
          new: true,
          upsert: true, // Make this update into an upsert
        }).then((res3) => {
          res.send(res3);
        });
      })
      .catch((err) => {
        console.log("Error: ", err.message);
      });
  } else {
    res.sendStatus(401);
  }
});

const server = app.listen(6001, () => {
  const host = server.address().address;
  const port = server.address().port;

  console.log("Listening on %s port %s", host, port);
});

// Old Eth route

// app.post("/eth", async (req, res) => {
//   const ETHERSCAN_APIKEY = process.env.ETHERSCAN_APIKEY;
//   const { apiKey } = req.query;

//   if (apiKey === process.env.BACKEND_KEY) {
//     axios
//       .get(
//         `https://api.etherscan.io/api?module=account&action=balance&address=0x165CD37b4C644C2921454429E7F9358d18A45e14&tag=latest&apikey=${ETHERSCAN_APIKEY}`
//       )
//       .then((res2) => {
//         console.log(res2.data);
//         // Convert response amount (in wei) to Eth
//         const amount_eth = weiToEth(res2.data.result);
//         const data = {
//           address: "0x165CD37b4C644C2921454429E7F9358d18A45e14",
//           amount_eth: amount_eth,
//         };
//         Eth.insertMany(data, function (err, result) {
//           if (err) {
//             res.send(err);
//           } else {
//             res.send(result);
//           }
//         });
//       })
//       .catch((err) => {
//         console.log("Error: ", err.message);
//       });
//   } else {
//     res.sendStatus(401);
//   }
// });
