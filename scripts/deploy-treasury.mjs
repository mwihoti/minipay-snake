import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { ethers } from 'ethers';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load .env.local explicitly
dotenv.config({ path: path.join(__dirname, '../.env.local') });

async function main() {
  console.log("Deploying CeloTreasury contract...");

  // Setup
  const PRIVATE_KEY = process.env.PRIVATE_KEY;
  const RPC_URL = "https://forno.celo-sepolia.celo-testnet.org/";
  const TREASURY_ADDRESS = "0x1567F1627220b92eA73BF69962682C8b24ca5F1B"; // Your treasury account

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
  const contractPath = path.join(__dirname, '../artifacts/contracts/CeloTreasury.sol/CeloTreasury.json');
  const contractArtifact = JSON.parse(fs.readFileSync(contractPath, 'utf8'));

  // Create contract factory and deploy
  const factory = new ethers.ContractFactory(contractArtifact.abi, contractArtifact.bytecode, signer);
  console.log("Deploying contract with treasury:", TREASURY_ADDRESS);
  const contract = await factory.deploy(TREASURY_ADDRESS);
  
  const deploymentTx = contract.deploymentTransaction();
  console.log("Deployment tx:", deploymentTx?.hash);

  await contract.waitForDeployment();

  const contractAddress = await contract.getAddress();
  console.log("✅ CeloTreasury deployed to:", contractAddress);

  console.log("\n📝 Next steps:");
  console.log("1. Update .env.local with:");
  console.log(`   NEXT_PUBLIC_TREASURY_CONTRACT=${contractAddress}`);
  console.log("2. Fund the treasury with CELO:");
  console.log(`   node scripts/fund-treasury.mjs`);
  console.log("3. Restart dev server:");
  console.log(`   npm run dev`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
