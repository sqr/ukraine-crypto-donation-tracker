import React from "react";
import GraphBtc from "./GraphBtc";
import GraphEth from "./GraphEth";
import TotalDonated from "./TotalDonated";
import Erc20Table from "./Erc20Table";

export default function Home() {
  return (
    <div className="wrapper">
      <div className="center">
        <TotalDonated />
      </div>
      <div className="graphs">
        <GraphBtc />
        <GraphEth />
      </div>
      <div className="center">
        <h2>ERC20 Tokens Transfered</h2>
        <Erc20Table />
      </div>
    </div>
  );
}
