'use client';

import React, { useState, useEffect } from 'react';
import { GameState } from '@/lib/gameEngine';
import { getMiniPayAddress, getBalance, submitScore } from '@/lib/celoIntegration';
import { WalletConnect } from './WalletConnect';
import { LandsManager } from './LandsManager';
import { RewardsSubmitter } from './RewardsSubmitter';
import { LevelMilestone } from './LevelMilestone';
import { PlayerStats } from './PlayerStats';

interface GameUIProps {
  gameState: GameState;
  onReset: () => void;
  onStartGame: () => void;
  isConnected: boolean;
  onDirectionChange?: (direction: 'up' | 'down' | 'left' | 'right') => void;
  onPauseToggle?: () => void;
}

export const GameUI: React.FC<GameUIProps> = ({ gameState, onReset, onStartGame, isConnected, onDirectionChange, onPauseToggle }) => {
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string>('0');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Get MiniPay address on load and sync with connection status
  useEffect(() => {
    const initAddress = async () => {
      if (isConnected) {
        const addr = await getMiniPayAddress();
        setAddress(addr);
        if (addr) {
          const bal = await getBalance(addr, false);
          setBalance(bal);
        }
      }
    };
    initAddress();
  }, [isConnected]);

  const handleDirectionClick = (direction: 'up' | 'down' | 'left' | 'right') => {
    // Prevent 180-degree turns
    if (
      (direction === 'up' && gameState.direction === 'down') ||
      (direction === 'down' && gameState.direction === 'up') ||
      (direction === 'left' && gameState.direction === 'right') ||
      (direction === 'right' && gameState.direction === 'left')
    ) {
      return;
    }
    onDirectionChange?.(direction);
  };

  const handleSubmitScore = async () => {
    if (!address) return;

    setSubmitting(true);
    const txHash = await submitScore(gameState.score, address, false);
    setSubmitting(false);

    if (txHash) {
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  return (
    <>
      {/* Start Game Overlay - Completely separate from other UI */}
      {!gameState.gameStarted && !gameState.gameOver && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999] pointer-events-auto backdrop-blur-sm">
          <div className="text-center space-y-6 px-6">
            <div className="mb-8">
              <h1 className="text-6xl md:text-8xl font-bold text-green-400 mb-2 drop-shadow-lg animate-pulse">
                🐍 PARK SNAKE
              </h1>
              <p className="text-xl md:text-2xl text-white font-semibold drop-shadow">
                Play • Earn • Repeat
              </p>
            </div>
            
            <button
              onClick={onStartGame}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 active:from-green-700 active:to-green-800 text-white text-2xl md:text-3xl font-bold py-6 px-12 rounded-2xl shadow-2xl transform hover:scale-105 active:scale-95 transition-all duration-200 border-4 border-green-400 cursor-pointer"
            >
              🎮 START GAME
            </button>
            
            <div className="text-white/80 text-sm md:text-base space-y-2 mt-8">
              <p>🎯 Collect food to grow and score points</p>
              <p>🌳 Avoid trees and yourself</p>
              <p>💰 Earn 0.3 CELO per level milestone</p>
              <p className="text-yellow-300 font-semibold">🌅 Unlock Sunset Mode at 1,000 points!</p>
            </div>
            
            <div className="text-white/60 text-xs md:text-sm mt-6">
              <p>Controls: Arrow Keys or WASD | Mobile: Swipe</p>
              <p>Space: Pause | ESC: Stats</p>
            </div>
          </div>
        </div>
      )}

      <div className="fixed inset-0 pointer-events-none">
        {/* Top HUD */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-auto z-10">
          {/* Wallet Connection - Top Right */}
        <div className="absolute -top-4 -right-4">
          <WalletConnect />
        </div>

        {/* Score - Wooden Sign */}
        <div className="wooden-sign">
          <div className="text-yellow-100 text-sm">SCORE</div>
          <div className="text-yellow-300 text-lg font-bold">{gameState.score}</div>
        </div>

        {/* Level Info */}
        <div className="text-center">
          <div className="text-green-100 text-xs font-bold mb-1">
            {gameState.sunsetMode ? '🌅 SUNSET MODE' : '🌳 PARK MODE'}
          </div>
          <div className="text-white text-xs">
            {gameState.snake.length} segments
          </div>
        </div>

        {/* Balance & Actions - MiniPay */}
        {isConnected && address && (
          <div className="flex flex-col gap-2">
            <div className="wooden-sign text-right">
              <div className="text-blue-900 text-xs">cUSD/CELO Balance</div>
              <div className="text-blue-600 text-lg font-bold">${Number(balance).toFixed(2)}</div>
            </div>
            <a
              href={`https://explorer.celo.org/sepolia/address/${address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-purple-600 hover:bg-purple-700 text-white py-1 px-3 text-xs font-bold rounded transition text-center"
              title="View your achievements and transactions on-chain"
            >
              🏆 My Stats
            </a>
          </div>
        )}
      </div>

      {/* Center Info */}
      {gameState.gamePaused && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
          <div className="park-bench p-8 text-center">
            <div className="text-white text-xl mb-4">PAUSED</div>
            <div className="text-white text-xs mb-4">Press SPACE to continue</div>
            <div className="text-yellow-300 text-sm">Score: {gameState.score}</div>
          </div>
        </div>
      )}

      {/* Game Over Screen - Scrollable */}
      {gameState.gameOver && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 pointer-events-auto overflow-y-auto">
          <div className="park-bench p-8 text-center max-w-sm my-4 max-h-[90vh] overflow-y-auto">
            <div className="text-red-400 text-2xl mb-4">GAME OVER</div>

            <div className="mb-6 border-t-2 border-b-2 border-yellow-600 py-4">
              <div className="text-white text-sm mb-2">Final Score</div>
              <div className="text-yellow-300 text-3xl font-bold mb-2">{gameState.score}</div>

              {gameState.sunsetMode && (
                <div className="text-orange-300 text-xs mt-2">🌅 Sunset Mode Unlocked!</div>
              )}

              <div className="text-white text-xs mt-2">
                {gameState.snake.length} segments • {gameState.trees.length} trees
              </div>
            </div>

            {/* Reward Calculation */}
            <div className="mb-6 text-left">
              <div className="text-yellow-100 text-xs mb-2">Reward Breakdown</div>
              <div className="text-white text-xs space-y-1">
                <div>Base: {gameState.score} pts</div>
                <div>Reward: {(gameState.score / 100).toFixed(2)} cUSD</div>
                {gameState.sunsetMode && <div className="text-orange-300">+50% Sunset Bonus</div>}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {isConnected && (
                <button
                  onClick={handleSubmitScore}
                  disabled={submitting || submitted}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-500 text-white py-2 px-4 text-xs font-bold rounded transition"
                >
                  {submitting ? 'SUBMITTING...' : submitted ? '✓ SUBMITTED' : 'SUBMIT SCORE'}
                </button>
              )}

              <button
                onClick={onReset}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 text-xs font-bold rounded transition"
              >
                NEW GAME
              </button>
            </div>

            {/* Play-to-Earn Rewards Section */}
            <RewardsSubmitter gameState={gameState} />

            {/* Level Milestone Section */}
            <LevelMilestone gameState={gameState} />

            {/* Player Stats & Achievements */}
            <PlayerStats gameState={gameState} />

            <div className="text-white text-xs mt-4 opacity-60">
              Arrow Keys or WASD to move • SPACE to pause
            </div>
          </div>
        </div>
      )}

      {/* Bottom Controls - Centered Instructions */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 pointer-events-auto">
        {/* Instructions - More Visible */}
        <div className="text-white text-sm font-bold bg-black/50 px-4 py-2 rounded border-2 border-green-500">
          <div className="text-center">↑↓←→ WASD Move</div>
          <div className="text-center">SPACE Pause</div>
        </div>

        {/* Connection Status */}
       
      </div>

      {/* Sunset Filter - visual effect */}
      {gameState.sunsetMode && (
        <div className="absolute inset-0 sunset-filter pointer-events-none" />
      )}

      {/* Mobile D-Pad Controls - Centered & Enlarged */}
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 md:hidden pointer-events-auto">
        <div className="relative w-48 h-48">
          {/* Up Button */}
          <button
            onClick={() => handleDirectionClick('up')}
            className="absolute top-0 left-1/2 -translate-x-1/2 w-14 h-14 bg-green-600 hover:bg-green-700 active:bg-green-800 rounded border-2 border-green-700 flex items-center justify-center text-white font-bold text-2xl transition"
          >
            ↑
          </button>

          {/* Left Button */}
          <button
            onClick={() => handleDirectionClick('left')}
            className="absolute top-1/2 left-0 -translate-y-1/2 w-14 h-14 bg-green-600 hover:bg-green-700 active:bg-green-800 rounded border-2 border-green-700 flex items-center justify-center text-white font-bold text-2xl transition"
          >
            ←
          </button>

          {/* Down Button */}
          <button
            onClick={() => handleDirectionClick('down')}
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-14 bg-green-600 hover:bg-green-700 active:bg-green-800 rounded border-2 border-green-700 flex items-center justify-center text-white font-bold text-2xl transition"
          >
            ↓
          </button>

          {/* Right Button */}
          <button
            onClick={() => handleDirectionClick('right')}
            className="absolute top-1/2 right-0 -translate-y-1/2 w-14 h-14 bg-green-600 hover:bg-green-700 active:bg-green-800 rounded border-2 border-green-700 flex items-center justify-center text-white font-bold text-2xl transition"
          >
            →
          </button>
        </div>
      </div>

      {/* Pause Button (Mobile visible) */}
      <button
        onClick={onPauseToggle}
        className="absolute bottom-4 right-4 md:bottom-auto md:right-auto md:hidden bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-bold pointer-events-auto transition"
      >
        {gameState.gamePaused ? 'RESUME' : 'PAUSE'}
      </button>

      {/* Lands Manager */}
      <LandsManager />

      {/* Sunset Filter - visual effect */}
      {gameState.sunsetMode && (
        <div className="absolute inset-0 sunset-filter pointer-events-none" />
      )}
    </div>
    </>
  );
};
