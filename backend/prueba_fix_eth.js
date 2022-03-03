const mongoose = require("mongoose");
const { Btc, Eth, BtcExchange, EthExchange } = require("./model");
require("dotenv").config();

const mongoDB = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PW}@${process.env.MONGO_URL}/ukraine?authSource=admin`;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

db.once("open", function () {
  console.log("MongoDB database connection established successfully");
});
db.on("error", console.error.bind(console, "MongoDB connection error:"));

let mongo = [
  { amount_eth: 80 },
  { amount_eth: 100 },
  { amount_eth: 50 },
  { amount_eth: 0 },
  { amount_eth: 20 },
  { amount_eth: 30 },
  { amount_eth: 130 },
  { amount_eth: 400 },
];

const resMongo = [
  { amount_eth: 80 },
  { amount_eth: 100 },
  { amount_eth: 100 }, // tenias 50, pones 100 ahora y le sumas el guardado de antes, cero: se queda en 100
  { amount_eth: 150 }, // tenias 0, le pones 100 del anterior + el guardado de antes, 50: se queda en 150
  { amount_eth: 150 }, // tenias 20, le pones 150 del anterior + el guardado de antes, cero: se queda en 150
  { amount_eth: 170 }, // tenias 30, le pones el 150 anterior + el guardado de antes, 20: se queda en 170
  { amount_eth: 200 }, // tenias 130, le pones el 170 anterior + el guardado de antes, 30: se queda en 200
  { amount_eth: 400 }, // como 400 es mayor que 200, no se hace nada
];

// const allEth = async () => {
//   await Eth.find();
// };
// const fixEth = async () => {
//   const mongo = await Eth.find().sort({ createdAt: 1 });
//   //console.log(mongo);
//   let prevAmount = 0;

//   for (i = 1; i < mongo.length; i++) {
//     if (mongo[i].amount_eth < mongo[i - 1].amount_eth) {
//       oldValue = mongo[i].amount_eth;
//       mongo[i].amount_eth = mongo[i - 1].amount_eth + prevAmount;
//       //   const filter = { _id: mongo[i]._id };
//       //   const update = { amount_eth: mongo[i - 1].amount_eth + prevAmount };
//       //   const fix = await Eth.findOneAndUpdate(filter, update);
//       //   console.log(fix);
//       prevAmount = oldValue;
//       console.log(mongo[i]);
//     }
//   }
// };

const cutreFix = async () => {
  const mongo = await Eth.find({
    createdAt: {
      $gte: new Date("2022-02-28T04:24:04.162+00:00"),
      $lte: new Date("2022-03-02T04:00:15.089+00:00"),
    },
  }).sort({ createdAt: 1 });

  for (element of mongo) {
    const filter = { _id: element._id };
    const update = { amount_eth: element.amount_eth + 1990 };
    const fix = await Eth.findOneAndUpdate(filter, update);
    console.log(fix);
  }
};

cutreFix();

//console.log(mongo);
