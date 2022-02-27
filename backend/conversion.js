function satToBtc(sat) {
  const btc = sat / 100000000;
  return btc;
}

function weiToEth(wei) {
  const eth = +(wei / 1000000000000000000).toFixed(8);
  return eth;
}

module.exports = { satToBtc, weiToEth };
