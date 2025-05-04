// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Beatchain is ERC721, Ownable {
    uint256 private _currentTokenId; // Replace Counters with a simple uint256

    IERC20 public paymentToken;
    uint256 public mintPrice;

    struct Traits {
        uint256 tempo;
        uint8 melodyComplexity;
        uint8 bassDepth;
        uint8 percussionIntensity;
        uint8 reverbAmount;
    }

    mapping(address => uint256[]) private ownerToTokens;
    mapping(uint256 => Traits) public tokenTraits;

    event Minted(address indexed minter, uint256 tokenId);
    event GetTraits(uint256 tokenId, Traits traits);

    constructor(
        address _paymentToken,
        uint256 _mintPrice
    ) ERC721("Beatchain", "BEAT") Ownable(msg.sender) {
        paymentToken = IERC20(_paymentToken);
        mintPrice = _mintPrice;
    }

    function updateTraits(
        uint256 tokenId,
        uint8 tempo,
        uint8 melodyComplexity,
        uint8 bassDepth,
        uint8 percussionIntensity,
        uint8 reverbAmount
    ) external returns (uint256) {
        require(ownerOf(tokenId) == msg.sender, "Not the token owner");
        // Update traits for the given tokenId
        tokenTraits[tokenId] = Traits({
            tempo: tempo,
            melodyComplexity: melodyComplexity,
            bassDepth: bassDepth,
            percussionIntensity: percussionIntensity,
            reverbAmount: reverbAmount
        });
        return tokenId;
    }

    function mint(
        uint8 tempo,
        uint8 melodyComplexity,
        uint8 bassDepth,
        uint8 percussionIntensity,
        uint8 reverbAmount
    ) public returns (uint256) {
        
        // Transfer payment
        require(paymentToken.transferFrom(msg.sender, address(this), mintPrice), "Payment failed");

        // Increment tokenId
        _currentTokenId++;
        uint256 newItemId = _currentTokenId;

        // Add to traits mapping
        tokenTraits[newItemId] = Traits({
            tempo: tempo,
            melodyComplexity: melodyComplexity,
            bassDepth: bassDepth,
            percussionIntensity: percussionIntensity,
            reverbAmount: reverbAmount
        });

        ownerToTokens[msg.sender].push(newItemId);

        // Mint the NFT
        _mint(msg.sender, newItemId);
        emit Minted(msg.sender, newItemId);

        return newItemId;
    }

//     function _beforeTokenTransfer(
//     address from,
//     address to,
//     uint256 tokenId
// ) internal override {
//     super._beforeTokenTransfer(from, to, tokenId);

//     if (from != address(0)) {
//         // Remove tokenId from old owner
//         uint256 length = ownerToTokens[from].length;
//         for (uint256 i = 0; i < length; ++i) {
//             if (ownerToTokens[from][i] == tokenId) {
//                 ownerToTokens[from][i] = ownerToTokens[from][length - 1];
//                 ownerToTokens[from].pop();
//                 break;
//             }
//         }
//     }

//     if (to != address(0)) {
//         // Add tokenId to new owner
//         ownerToTokens[to].push(tokenId);
//     }
// }

    // Setter for updating price
    function setMintPrice(uint256 _newPrice) external onlyOwner {
        mintPrice = _newPrice;
    }
}