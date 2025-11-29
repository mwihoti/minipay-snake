'use client';

import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Contract, BrowserProvider, parseEther } from 'ethers';
import { GameState } from '@/lib/gameEngine';
import { isMiniPay } from '@/lib/minipayUtils';

interface RewardsSubmitterProps {
  gameState: GameState;
  onScoreSubmitted?: (reward: number) => void;
}

const REWARDS_ABI = [
  'function submitScore(uint256 score, bool sunsetMode) external',
  'function getPlayerStats(address player) external view returns (tuple(uint256 totalEarned, uint256 totalScored, uint256 gamesPlayed, uint256 activeLandId, bool exists))',
];

export const RewardsSubmitter: React.FC<RewardsSubmitterProps> = ({ gameState, onScoreSubmitted }) => {
  const { address, isConnected } = useAccount();
  const [submitted, setSubmitted] = useState(false);
  const [estimatedReward, setEstimatedReward] = useState(0);
  const [isMiniPayApp, setIsMiniPayApp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check if running in MiniPay
  useEffect(() => {
    setIsMiniPayApp(isMiniPay());
  }, []);

  // Calculate estimated reward
  useEffect(() => {
    if (gameState.gameOver) {
      let reward = gameState.score * 0.01; // 0.01 cUSD per point
      
      if (gameState.sunsetMode) {
        reward *= 1.5; // 50% bonus
      }
      
      setEstimatedReward(Math.min(reward, 100)); // Max 100 cUSD
    }
  }, [gameState.gameOver, gameState.score, gameState.sunsetMode]);

  const handleSubmitToBlockchain = async () => {
    if (!isConnected || !address) {
      alert('Please connect your wallet first');
      return;
    }

    try {
      setIsLoading(true);
      
      const contractAddress = process.env.NEXT_PUBLIC_REWARDS_CONTRACT;
      if (!contractAddress) {
        throw new Error('Contract address not configured');
      }

      // Get window.ethereum provider (works in MiniPay and MetaMask)
      const provider = new BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();
      
      // Create contract instance
      const contract = new Contract(contractAddress, REWARDS_ABI, signer);
      
      // Submit score to blockchain
      const scoreToSubmit = Math.floor(gameState.score);
      console.log('Submitting score:', scoreToSubmit, 'Sunset mode:', gameState.sunsetMode);
      
      const tx = await contract.submitScore(scoreToSubmit, gameState.sunsetMode);
      console.log('Transaction sent:', tx.hash);
      
      // Wait for confirmation
      const receipt = await tx.wait();
      console.log('Transaction confirmed:', receipt?.hash);
      
      setSubmitted(true);
      onScoreSubmitted?.(estimatedReward);
      alert(`✅ Score submitted! Earned ${estimatedReward.toFixed(2)} cUSD`);
      
      // Show submitted state for 3 seconds
      setTimeout(() => {
        setSubmitted(false);
      }, 3000);
    } catch (error) {
      console.error('Failed to submit score:', error);
      alert('Error submitting score. Make sure contract is funded with cUSD.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {gameState.gameOver && isConnected && (
        <div className="mt-4 bg-blue-500/20 border-2 border-blue-400 rounded-lg p-4">
          <div className="text-white text-sm mb-3">
            <div className="font-bold mb-2">💰 Play-to-Earn Rewards {isMiniPayApp && '(MiniPay)'}</div>
            <div>
              Base Reward: <span className="text-yellow-300">{(gameState.score / 100).toFixed(2)}</span> cUSD
            </div>
            {gameState.sunsetMode && (
              <div>
                Sunset Bonus: <span className="text-orange-300">+50%</span>
              </div>
            )}
            <div className="border-t border-blue-300 mt-2 pt-2 font-bold">
              Total Reward: <span className="text-green-300">${estimatedReward.toFixed(2)}</span> cUSD
            </div>
          </div>

          <button
            onClick={handleSubmitToBlockchain}
            disabled={submitted || isLoading}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-500 text-white py-2 px-4 text-sm font-bold rounded transition"
          >
            {isLoading ? '⏳ SUBMITTING...' : submitted ? '✅ SUBMITTED!' : isMiniPayApp ? '🚀 CLAIM (MiniPay)' : '🚀 CLAIM REWARD ON CELO'}
          </button>
        </div>
      )}
    </>
  );
};
