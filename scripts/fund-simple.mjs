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
  console.log("Target contract:", contractAddress);

  // cUSD contract address
  const cUSD = "0x86A37B6CA4F0123b643F785385eb0860D5ee810d";
  
  // Amount to fund (10 cUSD)
  const fundAmount = ethers.parseEther("10");

  // Get cUSD contract
  const IERC20_ABI = [
    "function approve(address spender, uint256 amount) external returns (bool)",
    "function transfer(address to, uint256 amount) external returns (bool)",
    "function transferFrom(address from, address to, uint256 amount) external returns (bool)",
    "function balanceOf(address account) external view returns (uint256)",
  ];

  const cUSDContract = new ethers.Contract(cUSD, IERC20_ABI, signer);

  // Transfer cUSD directly to contract (simpler than using fundContract)
  console.log("Transferring 10 cUSD directly to contract...");
  try {
    const transferTx = await cUSDContract.transfer(contractAddress, fundAmount);
    const transferReceipt = await transferTx.wait();
    console.log("✅ Contract funded with 10 cUSD! (tx:", transferReceipt.hash, ")");
  } catch (error) {
    console.error("❌ Transfer failed:", error.message);
    console.error("Make sure you have cUSD on testnet. Get from: https://faucet.celo.org");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
