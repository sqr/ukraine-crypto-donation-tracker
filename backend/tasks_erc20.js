let { Chain } = require("repeat");
const axios = require("axios");
require("dotenv").config();

let chain = new Chain();

const API_URL = process.env.API_URL;
const BACKEND_KEY = process.env.BACKEND_KEY;

chain
  .add(
    // Query API to insert ERC20 tokens data in DB
    () => {
      axios.post(`${API_URL}/erc20?apiKey=${BACKEND_KEY}`).then((res) => {
        console.log(res.data);
      });
    }
  )
  // Every 2 hours
  .every(7200000);
