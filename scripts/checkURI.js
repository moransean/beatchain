const { ethers } = require("hardhat");

async function main() {
  const contractAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
  const beatchain = await ethers.getContractAt("Beatchain", contractAddress);

  const tokenId = 7;
  const uri = await beatchain.tokenURI(tokenId);
  console.log(`Token URI for ${tokenId}: ${uri}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
