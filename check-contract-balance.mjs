import { ethers } from 'ethers';
import * as dotenv from 'dotenv';

dotenv.config();

const REWARDS_CONTRACT = '0x9C1883C198feB1a02b7e5a410Fe72Ff4E4951a1f';
const CUSD_ADDRESS = '0x86A37B6CA4F0123b643F785385eb0860D5ee810d';
const RPC_URL = 'https://forno.celo-sepolia.celo-testnet.org/';

const provider = new ethers.JsonRpcProvider(RPC_URL);

// cUSD ERC20 ABI (minimal)
const cUSDAbi = [
  'function balanceOf(address account) view returns (uint256)',
  'function decimals() view returns (uint8)',
];

const cUSD = new ethers.Contract(CUSD_ADDRESS, cUSDAbi, provider);

try {
  const balance = await cUSD.balanceOf(REWARDS_CONTRACT);
  const decimals = await cUSD.decimals();
  const balanceFormatted = ethers.formatUnits(balance, decimals);
  
  console.log(`💰 Rewards Contract (${REWARDS_CONTRACT}):`);
  console.log(`   cUSD Balance: ${balanceFormatted} cUSD`);
  console.log(`   Raw Balance: ${balance.toString()}`);
  
  if (parseFloat(balanceFormatted) < 0.1) {
    console.log('\n⚠️  CONTRACT NEEDS FUNDING - Less than 0.1 cUSD!');
  } else {
    console.log('\n✓ Contract has sufficient cUSD');
  }
} catch (error) {
  console.error('Error checking balance:', error.message);
}
