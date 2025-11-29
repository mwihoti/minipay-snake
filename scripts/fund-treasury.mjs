import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { ethers } from 'ethers';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load .env.local explicitly
dotenv.config({ path: path.join(__dirname, '../.env.local') });

async function main() {
  const treasuryAddress = process.env.NEXT_PUBLIC_TREASURY_CONTRACT;
  if (!treasuryAddress) {
    throw new Error("NEXT_PUBLIC_TREASURY_CONTRACT not set in .env.local");
  }

  const PRIVATE_KEY = process.env.PRIVATE_KEY;
  const RPC_URL = "https://forno.celo-sepolia.celo-testnet.org/";

  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const signer = new ethers.Wallet(PRIVATE_KEY, provider);

  console.log("Funding treasury from:", signer.address);

  // Amount to fund (1.5 CELO = enough for 5 level-ups)
  const fundAmount = ethers.parseEther("1.5");

  console.log("Sending 1.5 CELO to treasury...");
  const tx = await signer.sendTransaction({
    to: treasuryAddress,
    value: fundAmount,
  });

  console.log("Transaction sent:", tx.hash);
  const receipt = await tx.wait();
  console.log("✅ Treasury funded with 1.5 CELO!");
  console.log("Transaction receipt:", receipt?.hash);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
