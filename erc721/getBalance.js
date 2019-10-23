const {
  addressFrom,
  addressTo,
  contract,
  web3
} = require('./config.js')

//Test contract method: get balance of from address
async function getBalance(address) {
  const balance = await contract.methods.balanceOf(address).call()
  return balance
}
const balanceOfAddress = async (address) => {
  const balance = await getBalance(address);
  console.log(`Address ${address} got balance: ${balance.toString()}`);
  const currentHeight = await web3.eth.getBlockNumber();
  const events = await contract.getPastEvents("allEvents", {fromBlock: currentHeight - 2, toBlock: currentHeight})
  console.log("Events received");
  console.log(events);
  return balance
}
balanceOfAddress(addressTo);
