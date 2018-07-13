pragma solidity ^0.4.4;
import "../../node_modules/openzeppelin-solidity/contracts/payment/PullPayment.sol";

contract LedgerPullPayment is PullPayment {
  constructor() public {
  }
  function savePayment() public payable {
    PullPayment.asyncSend(msg.sender, msg.value);
  }
}
