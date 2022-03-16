function reduceCrypto(data) {
  let result = [];
  for (record in data) {
    // console.log(data[0].createdAt);
    const createdAt = data[record].createdAt;
    const prevCreatedAt = data[record - 1]
      ? data[record - 1].createdAt
      : new Date(0);
    const hour = createdAt.getHours();
    const prevHour = prevCreatedAt.getHours();
    if (hour != prevHour) {
      result.push(data[record]);
    }
  }
  return result;
}

module.exports = { reduceCrypto };
