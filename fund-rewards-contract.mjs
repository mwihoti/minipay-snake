import { ethers } from 'ethers';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const REWARDS_CONTRACT = '0x9C1883C198feB1a02b7e5a410Fe72Ff4E4951a1f';
const CUSD_ADDRESS = '0x86A37B6CA4F0123b643F785385eb0860D5ee810d';
const RPC_URL = 'https://forno.celo-sepolia.celo-testnet.org/';
const PRIVATE_KEY = process.env.PRIVATE_KEY;

if (!PRIVATE_KEY) {
  console.error('❌ PRIVATE_KEY not found in .env.local');
  process.exit(1);
}

const provider = new ethers.JsonRpcProvider(RPC_URL);
const signer = new ethers.Wallet(PRIVATE_KEY, provider);

// cUSD ERC20 ABI (minimal)
const cUSDAbi = [
  'function balanceOf(address account) view returns (uint256)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function decimals() view returns (uint8)',
];

const cUSD = new ethers.Contract(CUSD_ADDRESS, cUSDAbi, signer);

async function fundContract() {
  try {
    console.log('�� Funding cUSD Rewards Contract...');
    console.log(`   From: ${signer.address}`);
    console.log(`   To: ${REWARDS_CONTRACT}`);
    console.log(`   Token: cUSD (${CUSD_ADDRESS})`);
    
    // Check sender balance
    const userBalance = await cUSD.balanceOf(signer.address);
    const decimals = await cUSD.decimals();
    const userBalanceFormatted = ethers.formatUnits(userBalance, decimals);
    console.log(`\n   Sender cUSD Balance: ${userBalanceFormatted} cUSD`);
    
    // Fund with 2 cUSD
    const fundAmount = ethers.parseUnits('2', decimals);
    
    if (userBalance < fundAmount) {
      console.error(`\n❌ Insufficient balance! Need 2 cUSD, have ${userBalanceFormatted} cUSD`);
      process.exit(1);
    }
    
    console.log(`\n   Sending 2 cUSD...`);
    const tx = await cUSD.transfer(REWARDS_CONTRACT, fundAmount);
    console.log(`   📝 Transaction: ${tx.hash}`);
    
    const receipt = await tx.wait();
    console.log(`   ✅ Confirmed in block ${receipt.blockNumber}`);
    
    // Check new balance
    const newBalance = await cUSD.balanceOf(REWARDS_CONTRACT);
    const newBalanceFormatted = ethers.formatUnits(newBalance, decimals);
    console.log(`\n✅ Rewards Contract now has: ${newBalanceFormatted} cUSD`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

fundContract();
