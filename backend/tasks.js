let { Chain } = require("repeat");
const axios = require("axios");
require("dotenv").config();

let chain = new Chain();

const API_URL = process.env.API_URL;
const BACKEND_KEY = process.env.BACKEND_KEY;

chain
  .add(
    // Query API to insert BTC data in DB
    () => {
      axios.post(`${API_URL}/btc?apiKey=${BACKEND_KEY}`).then((res) => {
        console.log(res.data);
      });
    },
    // Query API to insert ETH data in DB
    () => {
      axios.post(`${API_URL}/eth?apiKey=${BACKEND_KEY}`).then((res) => {
        console.log(res.data);
      });
    }
  )
  // Every 5 mins
  .every(300000);
