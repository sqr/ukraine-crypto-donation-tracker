import React from "react";
import GraphBtc from "./GraphBtc";
import GraphEth from "./GraphEth";
import TotalDonated from "./TotalDonated";

import { TwitterTweetEmbed } from "react-twitter-embed";

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
        <h2>Always double check target addresses when donating.</h2>
        <div className="tweet">
          <TwitterTweetEmbed
            tweetId={"1497594592438497282"}
            width="1000px"
            options={{ theme: "dark" }}
          />
        </div>
      </div>
    </div>
  );
}
