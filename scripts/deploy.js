const hre = require("hardhat");

async function main() {
  // Get the contract factory
  const FileStorage = await hre.ethers.getContractFactory("FileStorage");

  // Deploy the contract
  const fileStorage = await FileStorage.deploy();

  // Wait for the deployment transaction to be mined
  await fileStorage.waitForDeployment();

  // Log the deployed contract address
  console.log("FileStorage deployed to:", await fileStorage.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });