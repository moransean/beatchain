const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  // Replace with your YODA and Beatchain contract addresses
  const yodaAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const beatchainAddress = "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512";

  const yoda = await ethers.getContractAt("YODA", yodaAddress);
  const mintPrice = ethers.utils.parseUnits("10000", 2); // e.g. 10000 YODA

  const tx = await yoda.approve(beatchainAddress, mintPrice);
  await tx.wait();

  console.log(`Approved ${mintPrice.toString()} YODA to Beatchain contract`);
}

main().catch((error) => {
  console.error("❌ Approval failed:", error);
  process.exitCode = 1;
});
