const { ethers } = require("hardhat");

async function main() {
  const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
  const beatchain = await ethers.getContractAt("Beatchain", contractAddress);

  const [_, user] = await ethers.getSigners();
  const balance = await beatchain.balanceOf(user.address);
  console.log(`${user.address} owns ${balance.toString()} Beatchains`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
