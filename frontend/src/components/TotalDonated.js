import React, { useState, useEffect } from "react";

export default function TotalDonated() {
  const API_SERVER = process.env.REACT_APP_API_URL;

  const [data, setData] = useState({ eth: 0, btc: 0, total: 0 });

  useEffect(() => {
    const requestOptions = {
      method: "GET",
    };
    fetch(`${API_SERVER}/total`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        setData(data);
      });
  }, [API_SERVER]);
  return (
    <div>
      <h1>🇺🇦 Ukrania crypto donation tracker</h1>
      <div className="center">
        <h1>
          Total Donated: $
          {data.total.toLocaleString(undefined, { maximumFractionDigits: 2 })}
        </h1>
      </div>
      <div className="center">
        <h3>
          BTC Donated: $
          {data.btc.toLocaleString(undefined, { maximumFractionDigits: 2 })}
        </h3>
      </div>
      <div className="center">
        <h3>
          ETH Donated: $
          {data.eth.toLocaleString(undefined, { maximumFractionDigits: 2 })}
        </h3>
      </div>
    </div>
  );
}
