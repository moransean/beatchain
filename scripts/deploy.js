const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying with account:", deployer.address);

  const paymentTokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const mintPrice = hre.ethers.utils.parseUnits("100", 2);
  const baseURI = "http://localhost:5000/traits";

  const Beatchain = await hre.ethers.getContractFactory("Beatchain");
  const contract = await Beatchain.deploy(paymentTokenAddress, mintPrice, baseURI);
  await contract.deployed();

  console.log("Beatchain deployed to:", contract.address);
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
