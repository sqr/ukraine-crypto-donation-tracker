const axios = require("axios");
require("dotenv").config();

const API_URL = process.env.API_URL;
const BACKEND_KEY = process.env.BACKEND_KEY;

function cryptoJob(jobName) {
  axios.post(`${API_URL}/${jobName}?apiKey=${BACKEND_KEY}`).then((res) => {
    console.log(res.data);
  });
}

module.exports = { cryptoJob };
