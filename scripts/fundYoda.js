const hre = require("hardhat");

async function main() {
  const [signer1, signer2] = await hre.ethers.getSigners();

  const yodaAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const yoda = await hre.ethers.getContractAt("YODA", yodaAddress, signer2); // <- connect to signer2 here

  console.log("Calling sendMeFunds() from:", signer2.address);
  const tx = await yoda.sendMeFunds();
  await tx.wait();
  console.log("YODA tokens sent to:", signer2.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
