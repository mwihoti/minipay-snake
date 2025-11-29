import { Contract, BrowserProvider, parseEther } from 'ethers';

const TREASURY_ABI = [
  'function submitScoreWithLevels(uint256 score) external',
  'function getPlayerProgress(address player) external view returns (tuple(uint256 currentLevel, uint256 totalEarned, uint256 lastRewardedLevel, bool exists))',
  'function calculateLevel(uint256 score) external view returns (uint256)',
];

export interface PlayerProgress {
  currentLevel: bigint;
  totalEarned: bigint;
  lastRewardedLevel: bigint;
  exists: boolean;
}

/**
 * Submit score to treasury and receive CELO rewards at level milestones
 */
export async function submitScoreWithLevelRewards(
  score: number,
  treasuryContractAddress: string
): Promise<{ success: boolean; levelReached?: number; reward?: string; txHash?: string }> {
  try {
    if (!treasuryContractAddress) {
      throw new Error('Treasury contract address not set');
    }

    const provider = new BrowserProvider((window as any).ethereum);
    const signer = await provider.getSigner();

    const contract = new Contract(treasuryContractAddress, TREASURY_ABI, signer);

    console.log('Submitting score for level rewards:', score);
    const tx = await contract.submitScoreWithLevels(score);
    console.log('Transaction sent:', tx.hash);

    const receipt = await tx.wait();
    console.log('Transaction confirmed:', receipt?.hash);

    return {
      success: true,
      txHash: receipt?.hash,
    };
  } catch (error) {
    console.error('Failed to submit score with rewards:', error);
    return { success: false };
  }
}

/**
 * Get player's current level and earnings
 */
export async function getPlayerLevel(
  playerAddress: string,
  treasuryContractAddress: string
): Promise<PlayerProgress | null> {
  try {
    if (!treasuryContractAddress) {
      return null;
    }

    const provider = new BrowserProvider((window as any).ethereum);
    const contract = new Contract(treasuryContractAddress, TREASURY_ABI, provider);

    const progress = await contract.getPlayerProgress(playerAddress);
    return progress;
  } catch (error) {
    console.error('Failed to get player progress:', error);
    return null;
  }
}

/**
 * Calculate what level a score will reach
 */
export async function calculateLevelFromScore(
  score: number,
  treasuryContractAddress: string
): Promise<number> {
  try {
    if (!treasuryContractAddress) {
      return 0;
    }

    const provider = new BrowserProvider((window as any).ethereum);
    const contract = new Contract(treasuryContractAddress, TREASURY_ABI, provider);

    const level = await contract.calculateLevel(score);
    return Number(level);
  } catch (error) {
    console.error('Failed to calculate level:', error);
    return 0;
  }
}
