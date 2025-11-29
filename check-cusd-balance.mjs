import { ethers } from 'ethers';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env.local') });

const RPC_URL = 'https://forno.celo-sepolia.celo-testnet.org/';
const REWARDS_CONTRACT = process.env.NEXT_PUBLIC_REWARDS_CONTRACT;
const CUSD_ADDRESS = '0x86A37B6CA4F0123b643F785385eb0860D5ee810d';

const provider = new ethers.JsonRpcProvider(RPC_URL);

const cUSDAbi = [
  'function balanceOf(address account) view returns (uint256)',
  'function decimals() view returns (uint8)',
];

async function checkBalance() {
  try {
    const cUSD = new ethers.Contract(CUSD_ADDRESS, cUSDAbi, provider);
    
    console.log('🔍 Checking cUSD balance...');
    console.log(`Contract: ${REWARDS_CONTRACT}\n`);
    
    const balance = await cUSD.balanceOf(REWARDS_CONTRACT);
    const decimals = await cUSD.decimals();
    const balanceFormatted = ethers.formatUnits(balance, decimals);
    
    console.log(`📊 Current cUSD Balance: ${balanceFormatted} cUSD`);
    
    if (parseFloat(balanceFormatted) === 0) {
      console.log('\n⚠️  Contract has ZERO cUSD! Needs funding.');
    } else if (parseFloat(balanceFormatted) < 1) {
      console.log('\n⚠️  Contract has low cUSD balance. Consider refunding.');
    } else {
      console.log('\n✅ Contract has sufficient cUSD.');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkBalance();
