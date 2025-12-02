import { ethers } from 'ethers';

const TREASURY_ABI = [
  'event LevelReached(address indexed player, uint256 level, uint256 reward)',
  'function getPlayerProgress(address player) view returns (tuple(uint256 currentLevel, uint256 totalEarned, uint256 lastRewardedLevel, bool exists))',
];

export interface OnChainClaim {
  level: number;
  reward: string;
  txHash: string;
  blockNumber: number;
  timestamp: number;
}

/**
 * Fetch all level claims from blockchain events
 */
export async function fetchOnChainClaims(
  playerAddress: string,
  treasuryAddress: string
): Promise<OnChainClaim[]> {
  try {
    const provider = new ethers.JsonRpcProvider('https://forno.celo-sepolia.celo-testnet.org/');
    const contract = new ethers.Contract(treasuryAddress, TREASURY_ABI, provider);

    // Query LevelReached events for this player
    const filter = contract.filters.LevelReached(playerAddress);
    const events = await contract.queryFilter(filter);

    const claims: OnChainClaim[] = [];

    for (const event of events) {
      // Type guard: check if event has args property
      if (!('args' in event)) continue;
      
      const block = await event.getBlock();
      
      claims.push({
        level: Number(event.args?.[1] || 0),
        reward: ethers.formatEther(event.args?.[2] || 0),
        txHash: event.transactionHash,
        blockNumber: event.blockNumber,
        timestamp: block.timestamp * 1000, // Convert to milliseconds
      });
    }

    return claims.sort((a, b) => b.timestamp - a.timestamp); // Most recent first
  } catch (error) {
    console.error('Failed to fetch on-chain claims:', error);
    return [];
  }
}

/**
 * Get player progress from smart contract
 */
export async function getOnChainProgress(
  playerAddress: string,
  treasuryAddress: string
): Promise<{
  currentLevel: number;
  totalEarned: string;
  lastRewardedLevel: number;
  exists: boolean;
} | null> {
  try {
    const provider = new ethers.JsonRpcProvider('https://forno.celo-sepolia.celo-testnet.org/');
    const contract = new ethers.Contract(treasuryAddress, TREASURY_ABI, provider);

    const progress = await contract.getPlayerProgress(playerAddress);

    return {
      currentLevel: Number(progress.currentLevel),
      totalEarned: ethers.formatEther(progress.totalEarned),
      lastRewardedLevel: Number(progress.lastRewardedLevel),
      exists: progress.exists,
    };
  } catch (error) {
    console.error('Failed to fetch on-chain progress:', error);
    return null;
  }
}
