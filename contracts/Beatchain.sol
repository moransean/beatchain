// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Beatchain is ERC721URIStorage, Ownable {
    uint256 private _currentTokenId; // Replace Counters with a simple uint256

    IERC20 public paymentToken;
    uint256 public mintPrice;
    string public baseURI;

    constructor(
        address _paymentToken,
        uint256 _mintPrice,
        string memory _baseURI
    ) ERC721("Beatchain", "BEAT") Ownable(msg.sender){
        paymentToken = IERC20(_paymentToken);
        mintPrice = _mintPrice;
        baseURI = _baseURI; // IPFS or centralized link prefix
    }

    function mint() public returns (uint256) {
        // Transfer payment
        require(paymentToken.transferFrom(msg.sender, address(this), mintPrice), "Payment failed");

        // Increment tokenId
        _currentTokenId++;
        uint256 newItemId = _currentTokenId;

        // Generate metadata URI — initially it can just use the tokenId or tx hash
        string memory tokenURI = string(abi.encodePacked(baseURI, "/", uint2str(newItemId)));

        // Mint the NFT
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);

        return newItemId;
    }

    // Setters for updating base URI or price
    function setMintPrice(uint256 _newPrice) external onlyOwner {
        mintPrice = _newPrice;
    }

    function setBaseURI(string memory _newBaseURI) external onlyOwner {
        baseURI = _newBaseURI;
    }

    // Converts uint to string (for building URI)
    function uint2str(uint256 _i) internal pure returns (string memory str) {
        if (_i == 0) return "0";
        uint256 j = _i;
        uint256 length;
        while (j != 0) {
            length++;
            j /= 10;
        }
        bytes memory bstr = new bytes(length);
        uint256 k = length;
        j = _i;
        while (j != 0) {
            bstr[--k] = bytes1(uint8(48 + j % 10));
            j /= 10;
        }
        str = string(bstr);
    }
}