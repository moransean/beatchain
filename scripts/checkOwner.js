const { ethers } = require("hardhat");

async function main() {
  const contractAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
  const beatchain = await ethers.getContractAt("Beatchain", contractAddress);

  const tokenId = 7;
  const owner = await beatchain.ownerOf(tokenId);
  console.log(`Owner of token ${tokenId}: ${owner}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
