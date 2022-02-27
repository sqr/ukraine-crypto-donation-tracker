import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function Graph() {
  const API_SERVER = process.env.REACT_APP_API_URL;

  const [data2, setData2] = useState("");
  const [btcTotal, setBtcTotal] = useState("");
  const [btcDonations, setBtcDonations] = useState("");

  useEffect(() => {
    const requestOptions = {
      method: "GET",
    };
    fetch(`${API_SERVER}/btc`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        setData2(data);
        setBtcTotal(data[data.length - 1].amount_btc);
        setBtcDonations(data[data.length - 1].funded_txo_count);
      });
  }, [API_SERVER]);

  return (
    <div className="graphWrapper">
      <h1>
        <a
          href="https://www.blockchain.com/btc/address/357a3So9CbsNfBBgFYACGvxxS6tMaDoa1P"
          target="_blank"
          rel="noopener noreferrer"
        >
          BTC
        </a>
      </h1>
      <h2>Total amount donated: {btcTotal} ₿</h2>
      <h2>Number of donations: {btcDonations}</h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          width={500}
          height={300}
          data={data2}
          margin={{
            top: 25,
            right: 30,
            left: 30,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="white" />
          <XAxis
            dataKey="createdAt"
            stroke="white"
            tickFormatter={(value) =>
              new Date(value).toLocaleDateString("es-ES", {
                day: "numeric",
                month: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })
            }
          />
          <YAxis
            type="number"
            domain={[90, "dataMax"]}
            tickFormatter={(value) => value.toFixed(4)}
            stroke="white"
          />
          <Tooltip />
          <Legend />
          <Line
            name="BTC"
            type="monotone"
            dataKey="amount_btc"
            stroke="#f99c1c"
            activeDot={{ r: 8 }}
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
