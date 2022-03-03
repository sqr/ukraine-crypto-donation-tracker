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

  const [data, setData] = useState("");
  const [ethTotal, setEthTotal] = useState("");
  const [ethDonations, setEthDonations] = useState("");

  useEffect(() => {
    const requestOptions = {
      method: "GET",
    };
    fetch(`${API_SERVER}/eth`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        setEthTotal(data[data.length - 1].amount_eth);
        setEthDonations(data[data.length - 1].tx_count_in);
      });
  }, [API_SERVER]);

  return (
    <div className="graphWrapper">
      <h1>
        <a
          href="https://etherscan.io/address/0x165cd37b4c644c2921454429e7f9358d18a45e14"
          target="_blank"
          rel="noopener noreferrer"
        >
          ETH
        </a>
      </h1>
      <h2>Total amount donated: {ethTotal} Ξ</h2>
      <h2>Number of donations: {ethDonations}</h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          width={500}
          height={300}
          data={data}
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
            domain={[1790, "dataMax"]}
            tickFormatter={(value) => value.toFixed(4)}
            stroke="white"
          />
          <Tooltip />
          <Legend />
          <Line
            name="ETH"
            type="monotone"
            dataKey="amount_eth"
            stroke="#cdaefb"
            activeDot={{ r: 8 }}
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
