import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { ethers } from 'ethers';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load .env.local explicitly
dotenv.config({ path: path.join(__dirname, '../.env.local') });

async function main() {
  const contractAddress = process.env.NEXT_PUBLIC_REWARDS_CONTRACT;
  if (!contractAddress) {
    throw new Error("NEXT_PUBLIC_REWARDS_CONTRACT not set in .env.local");
  }

  const PRIVATE_KEY = process.env.PRIVATE_KEY;
  const RPC_URL = "https://forno.celo-sepolia.celo-testnet.org/";

  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const signer = new ethers.Wallet(PRIVATE_KEY, provider);

  console.log("Funding contract from:", signer.address);

  // cUSD contract address on Celo Sepolia testnet
  const cUSD = "0x86A37B6CA4F0123b643F785385eb0860D5ee810d";
  
  // Amount to fund (10 cUSD for testing)
  const fundAmount = ethers.parseEther("10");

  // Get cUSD contract
  const IERC20_ABI = [
    "function approve(address spender, uint256 amount) external returns (bool)",
    "function transferFrom(address from, address to, uint256 amount) external returns (bool)",
    "function balanceOf(address account) external view returns (uint256)",
  ];

  const cUSDContract = new ethers.Contract(cUSD, IERC20_ABI, signer);

  // Check balance - skip if fails
  try {
    const balance = await cUSDContract.balanceOf(signer.address);
    console.log("Your cUSD balance:", ethers.formatEther(balance));

    if (balance < fundAmount) {
      console.error("❌ Insufficient cUSD balance. Need at least 10 cUSD.");
      console.error("Get testnet cUSD from: https://faucet.celo.org");
      return;
    }
  } catch (err) {
    console.log("⚠️  Could not check balance (testnet might not have cUSD token yet)");
  }

  // Approve contract to spend cUSD
  console.log("Approving contract to spend cUSD...");
  const approveTx = await cUSDContract.approve(contractAddress, fundAmount);
  const approveReceipt = await approveTx.wait();
  console.log("✅ Approved (tx:", approveReceipt.hash, ")");

  // Fund contract
  console.log("Funding contract with 100 cUSD...");
  const snakeContract = new ethers.Contract(
    contractAddress,
    ["function fundContract(uint256 amount) external"],
    signer
  );

  const fundTx = await snakeContract.fundContract(fundAmount);
  const fundReceipt = await fundTx.wait();
  
  console.log("✅ Contract funded with 100 cUSD! (tx:", fundReceipt.hash, ")");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
