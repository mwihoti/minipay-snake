const hre = require("hardhat");

async function main() {
  console.log("Deploying SnakeGameRewards contract...");

  // Get signer
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  // Get balance
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "CELO");

  // Deploy contract
  const SnakeGameRewards = await ethers.getContractFactory("SnakeGameRewards");
  const contract = await SnakeGameRewards.deploy();

  await contract.waitForDeployment();

  const contractAddress = await contract.getAddress();
  console.log("✅ SnakeGameRewards deployed to:", contractAddress);

  // Wait for confirmations before verification
  console.log("Waiting for block confirmations...");
  await contract.deploymentTransaction().wait(5);

  console.log("\n📝 Next steps:");
  console.log("1. Add to .env.local:");
  console.log(`   NEXT_PUBLIC_REWARDS_CONTRACT=${contractAddress}`);
  console.log("\n2. Fund the contract with testnet cUSD:");
  console.log(`   npx hardhat run scripts/fund-contract.js --network celoSepolia`);
  console.log("\n3. Verify contract on CeloScan:");
  console.log(`   npx hardhat verify ${contractAddress} --network celoSepolia`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
