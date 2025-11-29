import { ethers } from 'ethers';

const RPC_URL = 'https://alfajores-forno.celo-testnet.org';
const CUSD_ADDRESS = '0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1'; // Alfajores cUSD

const provider = new ethers.JsonRpcProvider(RPC_URL);
const balance = await provider.getBalance('0x1567F1627220b92eA73BF69962682C8b24ca5F1B');
console.log('CELO Balance:', ethers.formatEther(balance));

const cUSDAbi = ['function balanceOf(address) view returns (uint256)', 'function decimals() view returns (uint8)'];
const cUSD = new ethers.Contract(CUSD_ADDRESS, cUSDAbi, provider);
try {
  const decimals = await cUSD.decimals();
  const bal = await cUSD.balanceOf('0x1567F1627220b92eA73BF69962682C8b24ca5F1B');
  console.log('cUSD Balance:', ethers.formatUnits(bal, decimals));
} catch (err) {
  console.log('cUSD Error:', err.message);
}
