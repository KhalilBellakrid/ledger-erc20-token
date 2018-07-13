pragma solidity ^0.4.4;
import "../../node_modules/openzeppelin-solidity/contracts/token/ERC20/StandardToken.sol";

contract LedgerCoin is StandardToken {
  string public name = "LedgerCoin";
  string public symbol = "LGC";
  uint public decimals = 2;
  uint public INITIAL_SUPPLY = 10000 * (10 ** decimals);

  constructor() public {
    totalSupply_ = INITIAL_SUPPLY;
    balances[msg.sender] = INITIAL_SUPPLY;
  }
}
