import React, { useEffect, useState } from "react";
import Graph from "./Graph";

export default function Home() {
  const API_SERVER = process.env.REACT_APP_API_URL;
  console.log(API_SERVER);

  const [data, setData] = useState("DONACIONES");
  useEffect(() => {
    const requestOptions = {
      method: "GET",
    };
    fetch(`${API_SERVER}/test`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        setData(data.message);
      });
  }, [API_SERVER]);
  return (
    <div>
      <h1>🇺🇦 Ukrania crypto donation tracker</h1>
      <h2>{data}</h2>
      <Graph />
    </div>
  );
}
