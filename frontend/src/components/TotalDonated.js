import React, { useState, useEffect } from "react";

export default function TotalDonated() {
  const API_SERVER = process.env.REACT_APP_API_URL;

  const [data, setData] = useState({
    eth: 0,
    btc: 0,
    total: 0,
    usdt: 0,
    usdc: 0,
  });

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
      <h1>
        🇺🇦 Ukraine crypto donation tracker (src on{" "}
        <a
          href="https://github.com/sqr/ukraine-crypto-donation-tracker"
          target="_blank"
          rel="noreferrer noopener"
        >
          GitHub
        </a>
        )
      </h1>
      <div className="center">
        <h1>
          Total Donated: $
          {data.total.toLocaleString(undefined, { maximumFractionDigits: 2 })}
        </h1>
      </div>
      <div className="center">
        <table className="donations">
          <tbody>
            <tr>
              <td>
                <h3>ETH Donated:</h3>
              </td>
              <td>
                <h3>
                  $
                  {data.eth.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}
                </h3>
              </td>
            </tr>
            <tr>
              <td>
                <h3>BTC Donated:</h3>
              </td>
              <td>
                <h3>
                  $
                  {data.btc.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}
                </h3>
              </td>
            </tr>
            <tr>
              <td>
                <h3>USDT Donated:</h3>
              </td>
              <td>
                <h3>
                  $
                  {data.usdt.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}
                </h3>
              </td>
            </tr>
            <tr>
              <td>
                <h3>USDC Donated:</h3>
              </td>
              <td>
                <h3>
                  $
                  {data.usdc.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}
                </h3>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
