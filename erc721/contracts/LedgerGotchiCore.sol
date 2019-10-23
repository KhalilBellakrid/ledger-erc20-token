pragma solidity ^0.5.0;
import "../../node_modules/openzeppelin-solidity/contracts/token/ERC721/ERC721Full.sol";
import "../../node_modules/openzeppelin-solidity/contracts/token/ERC721/ERC721Mintable.sol";
import "../../node_modules/openzeppelin-solidity/contracts/token/ERC721/ERC721.sol";

//contract LedgerGotchiCore is ERC721Mintable, ERC721Full {
contract LedgerGotchiCore is ERC721Mintable {

  // Constants
  //string private _name = "LedgerGotchi";
  //string private _symbol = "LG";

  // Events
  event Birth(address owner, uint256 gotchiId, uint256 gotchaId, uint256 gotchoId, uint256 genes);
  event Transfer(address from, address to, uint256 gotchiId);

  struct Gotchi {
        // Genes of gotchi
        uint256 genes;
        uint64 birthTime;
        // Parents ID (0 for first generation)
        uint32 gotchaId;
        uint32 gotchoId;
        // Gotchi that we are in love with ...
        uint32 minglingWithId;
        uint16 generation;
    }
   Gotchi[] gotchies;
   mapping (uint256 => address) public gotchiIndexToOwner;
   mapping (address => uint256) ownershipTokenCount;
   mapping (uint256 => address) public mingleAllowedToAddress;
   mapping (uint256 => address) public gotchiIndexToApproved;
   //LedgerGotchiFactory public factory;

   //constructor() public ERC721Mintable() ERC721Full(_name, _symbol) {
   constructor() public ERC721Mintable() {

   }

  function _transfer(address _from, address _to, uint256 _gotchiId) internal {
          ownershipTokenCount[_to]++;
          // transfer ownership
          gotchiIndexToOwner[_gotchiId] = _to;
          if (_from != address(0)) {
              ownershipTokenCount[_from]--;
              delete mingleAllowedToAddress[_gotchiId];
              delete gotchiIndexToApproved[_gotchiId];
          }
          // Emit the transfer event.
          emit Transfer(_from, _to, _gotchiId);
    }

  function _owns(address _claimant, uint256 _gotchiId) internal view returns (bool) {
      return gotchiIndexToOwner[_gotchiId] == _claimant;
    }

  function _approvedFor(address _claimant, uint256 _gotchiId) internal view returns (bool) {
      return gotchiIndexToApproved[_gotchiId] == _claimant;
  }

  function _approve(uint256 _gotchiId, address _approved) internal {
      gotchiIndexToApproved[_gotchiId] = _approved;
  }

  function balanceOf(address _owner) public view returns (uint256 count) {
        return ownershipTokenCount[_owner];
  }

  function transfer(
        address _to,
        uint256 _gotchiId
    )
        external
    {
        require(_to != address(0));
        require(_to != address(this));
        require(_owns(msg.sender, _gotchiId));
        _transfer(msg.sender, _to, _gotchiId);
    }

    function approve(
        address _to,
        uint256 _gotchiId
    )
        public
    {
        // Only an owner can grant transfer approval.
        require(_owns(msg.sender, _gotchiId));

        // Register the approval (replacing any previous approval).
        _approve(_gotchiId, _to);

        // Emit approval event.
        emit Approval(msg.sender, _to, _gotchiId);
    }

    function transferFrom(
        address _from,
        address _to,
        uint256 _gotchiId
    )
        public
    {
        require(_to != address(0));

        require(_to != address(this));

        // Check for approval and valid ownership
        require(_approvedFor(msg.sender, _gotchiId));
        require(_owns(_from, _gotchiId));

        // Reassign ownership (also clears pending approvals and emits Transfer event).
        _transfer(_from, _to, _gotchiId);
    }

    function totalSupply() public view returns (uint) {
        return gotchies.length - 1;
    }

    function tokensOfOwner(address _owner) external view returns(uint256[] memory ownerTokens) {
        uint256 gotchiCount = balanceOf(_owner);

        if (gotchiCount == 0) {
            // Return an empty array
            return new uint256[](0);
        } else {
            uint256[] memory result = new uint256[](gotchiCount);
            uint256 totalGotchis = totalSupply();
            uint256 resultIndex = 0;

            uint256 gotchiId;

            for (gotchiId = 1; gotchiId <= totalGotchis; gotchiId++) {
                if (gotchiIndexToOwner[gotchiId] == _owner) {
                    result[resultIndex] = gotchiId;
                    resultIndex++;
                }
            }

            return result;
        }
    }

    // external
    // view
    // returns (address owner)
    function ownerOf(uint256 _gotchiId) public view returns (address owner)
    {
        owner = gotchiIndexToOwner[_gotchiId];

        require(owner != address(0));
    }
    function _createGotchi(
        uint256 _gotchaId,
        uint256 _gotchoId,
        uint256 _generation,
        uint256 _genes,
        address _owner
    )
        internal
        returns (uint)
    {
        // Gotchi starts with the same cooldown as parent gen/2
        uint16 restIndex = uint16(_generation / 2);
        if (restIndex > 5) {
            restIndex = 5;
        }

        Gotchi memory _gotchi = Gotchi({
            genes: _genes,
            birthTime: uint64(now),
            gotchaId: uint32(_gotchaId),
            gotchoId: uint32(_gotchoId),
            minglingWithId: 0,
            generation: uint16(_generation)
        });

        uint256 newGotchiId = gotchies.push(_gotchi) - 1;
        require(newGotchiId == uint256(uint32(newGotchiId)));

        // emit the birth certificate
        emit Birth(
          _owner,
          newGotchiId,
          uint256(_gotchi.gotchaId),
          uint256(_gotchi.gotchoId),
          _gotchi.genes
        );

        // Remove gotchi from parents and deliver to new happy owner ...
        _transfer(address(0), _owner, newGotchiId);

        return newGotchiId;
    }

    function random() private view returns (uint8) {
           return uint8(uint256(keccak256(abi.encodePacked(block.timestamp)))%101);
    }

    function sliceUint(bytes memory bs, uint start) internal pure returns (uint)
    {
      require(bs.length >= start + 32, "slicing out of range");
      uint x;
      assembly {
        x := mload(add(bs, add(0x20, start)))
      }
      return x;
    }

    function toBytes(uint256 x) internal pure returns (bytes memory b) {
      b = new bytes(32);
      assembly { mstore(add(b, 32), x) }
    }

    function mingle(uint256 gotchaId, uint256 gotchoId) public view returns (uint256) {
      bytes memory gotchaBytes = toBytes(gotchaId);
      bytes memory gotchoBytes = toBytes(gotchoId);

      for (uint i = 0; i <= 10; i++) {
        for (uint j = 3; j >= 0; j--) {
          if (random() < 25) {
            bytes1 tmpByte = gotchaBytes[j];
            gotchaBytes[j] = gotchaBytes[j+1];
            gotchaBytes[j+1] = tmpByte;
          }
          if (random() < 25) {
            bytes1 tmpByte = gotchoBytes[j];
            gotchoBytes[j] = gotchoBytes[j+1];
            gotchoBytes[j+1] = tmpByte;
          }
        }
      }
      bytes memory gotchiBytes = new bytes(32);
      for (uint i = 0; i < 32; i++) {
        uint8 mutation = 0;
        if (i % 4 == 0) {
          uint8 gene1 = uint8(gotchoBytes[i]);
          uint8 gene2 = uint8(gotchaBytes[i]);
          if (gene1 > gene2) {
              gene1 = gene2;
              gene2 = gene1;
          }
          bool isOk = (gene2 - gene1 == 1) && gene1 % 2 == 0;
          if (isOk) {
            uint8 probability = 25;
            if (gene1 > 23) {
              probability = probability / 2;
            }
            if (random() < probability) {
                mutation = (gene1 / 2) + 16;
            }
          }
        }

        if (mutation > 0) {
            gotchiBytes[i] = bytes1(mutation);
        } else {
          if (random() < 50) {
            gotchiBytes[i] = gotchoBytes[i];
          } else {
            gotchiBytes[i] = gotchaBytes[i];
          }
        }
      }
      return sliceUint(gotchiBytes, 0);
    }

    function gotchiFactory(uint256 _gotchaId) external returns(uint256){
      Gotchi storage gotcha = gotchies[_gotchaId];
        // Babies not allowed to give birth
        require(gotcha.birthTime != 0);

        uint256 gotchoId = gotcha.minglingWithId;
        Gotchi storage gotcho = gotchies[gotchoId];

        // Determine the higher generation number of the two parents
        uint16 parentGen = gotcha.generation;
        if (gotcho.generation > gotcha.generation) {
            parentGen = gotcho.generation;
        }

        // ADN manipulation
        uint256 childGenes = mingle(gotcha.genes, gotcho.genes);

        // Gotchi is alive ... (crying)
        address owner = gotchiIndexToOwner[_gotchaId];
        uint256 kittenId = _createGotchi(_gotchaId, gotcha.minglingWithId, parentGen + 1, childGenes, owner);

        // what a relief
        delete gotcha.minglingWithId;

        // return the new kitten's ID
        return kittenId;
    }

}
