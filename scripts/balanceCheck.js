const hre = require("hardhat");

async function main() {
  const [signer1, signer2] = await hre.ethers.getSigners();
  const yoda = await hre.ethers.getContractAt("YODA", "0x5FbDB2315678afecb367f032d93F642f64180aa3");

  const balance = await yoda.balanceOf(signer2.address);
  console.log(`YODA balance for ${signer2.address}:`, balance.toString());
}

main();
