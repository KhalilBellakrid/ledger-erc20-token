pragma solidity ^0.5.0;
import "../../node_modules/openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";
import "../../node_modules/openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";

contract LedgerCoin is ERC20, ERC20Detailed {
  string private _name = "LedgerLiveCoin";
  string private _symbol = "LLGC";
  uint8 private _decimals = 30;
  uint private _INITIAL_SUPPLY = 10000000000000000000 * (10 ** 30);

  constructor() ERC20Detailed(_name, _symbol, _decimals) public {
    _mint(msg.sender, _INITIAL_SUPPLY);
  }
}
