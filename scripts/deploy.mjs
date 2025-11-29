import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { ethers } from 'ethers';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load .env.local explicitly
dotenv.config({ path: path.join(__dirname, '../.env.local') });

async function main() {
  console.log("Deploying SnakeGameRewards contract...");

  // Setup
  const PRIVATE_KEY = process.env.PRIVATE_KEY;
  const RPC_URL = "https://forno.celo-sepolia.celo-testnet.org/";

  if (!PRIVATE_KEY) {
    throw new Error("PRIVATE_KEY not set in .env.local");
  }

  // Create provider and signer
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const signer = new ethers.Wallet(PRIVATE_KEY, provider);

  console.log("Deploying with account:", signer.address);

  // Get balance
  const balance = await provider.getBalance(signer.address);
  console.log("Account balance:", ethers.formatEther(balance), "CELO");

  // Read compiled contract
  const contractPath = path.join(__dirname, '../artifacts/contracts/SnakeGameRewards.sol/SnakeGameRewards.json');
  const contractArtifact = JSON.parse(fs.readFileSync(contractPath, 'utf8'));

  // Create contract factory and deploy
  const factory = new ethers.ContractFactory(contractArtifact.abi, contractArtifact.bytecode, signer);
  console.log("Deploying contract...");
  const contract = await factory.deploy();
  
  const deploymentTx = contract.deploymentTransaction();
  console.log("Deployment tx:", deploymentTx?.hash);

  await contract.waitForDeployment();

  const contractAddress = await contract.getAddress();
  console.log("✅ SnakeGameRewards deployed to:", contractAddress);

  console.log("\n📝 Next steps:");
  console.log("1. Add to .env.local:");
  console.log(`   NEXT_PUBLIC_REWARDS_CONTRACT=${contractAddress}`);
  console.log("\n2. Fund the contract with testnet cUSD:");
  console.log(`   node scripts/fund-contract.mjs`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
