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
  const transferEvents = await contract.getPastEvents("Transfer", {fromBlock: currentHeight - 50, toBlock: currentHeight});
  const approvalEvents = await contract.getPastEvents("Approval", {fromBlock: currentHeight - 50, toBlock: currentHeight});
  console.log("Transfer Events received");
  console.log(transferEvents.concat(approvalEvents));
  return balance
}
balanceOfAddress(addressFrom);
