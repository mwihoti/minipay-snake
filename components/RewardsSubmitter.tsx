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
      // Testnet: 0.009 cUSD per point (very small for testing)
      // At 1000 points = 0.009 cUSD, which translates to 0.3 CELO level reward
      let reward = gameState.score * 0.009;
      
      if (gameState.sunsetMode) {
        reward *= 1.5; // 50% bonus
      }
      
      setEstimatedReward(Math.min(reward, 0.9)); // Max 0.9 cUSD for testnet
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
    } catch (error: any) {
      console.error('Failed to submit score:', error);
      const errorMsg = error?.reason || error?.message || 'Unknown error';
      alert(`❌ Error submitting score:\n${errorMsg}\n\nMake sure contract is funded with cUSD.`);
    } finally {
      setIsLoading(false);
    }
  };

  // Disabled: Using only level-based CELO rewards (LevelMilestone component)
  return null;
};
