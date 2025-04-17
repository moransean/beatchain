// scripts/deployYoda.js
const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying YODA with account:", deployer.address);

  const YODA = await ethers.getContractFactory("YODA");
  const yoda = await YODA.deploy("Yoda Token", "YODA", 1000000); // 1 million supply
  await yoda.deployed();

  console.log("YODA deployed to:", yoda.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
