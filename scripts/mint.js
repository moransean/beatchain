const { ethers } = require("hardhat");

async function main() {
  const [deployer, signer2] = await ethers.getSigners();

  console.log("Minting with account:", signer2.address);

  // Replace with your deployed contract addresses
  const contractAddress = "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512"; // Beatchain contract
  const yodaTokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // YODA token contract

  // Get contract instances
  const beatchain = await ethers.getContractAt("Beatchain", contractAddress, signer2);
  const yoda = await ethers.getContractAt("YODA", yodaTokenAddress, signer2);

  // Approve Beatchain contract to spend 10,000 YODA (with 2 decimals, so "10000" = 100.00 YODA)
  const mintPrice = ethers.utils.parseUnits("10000", 2); // Make sure this matches contract mintPrice
  const approveTx = await yoda.approve(contractAddress, mintPrice);
  await approveTx.wait();
  console.log("Approved YODA spend.");

  // Call mint
  const tx = await beatchain.mint();
  const receipt = await tx.wait();

  console.log("Minted! Transaction hash:", receipt.transactionHash);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
