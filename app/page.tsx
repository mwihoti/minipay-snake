'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { GameCanvas } from '@/components/GameCanvas';
import { GameUI } from '@/components/GameUI';
import { GameState, INITIAL_STATE } from '@/lib/gameEngine';
import { getMiniPayAddress } from '@/lib/celoIntegration';

export default function Home() {
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE);
  const [isConnected, setIsConnected] = useState(false);

  // Initialize MiniPay connection
  useEffect(() => {
    const initConnection = async () => {
      const address = await getMiniPayAddress();
      setIsConnected(!!address);
    };

    // Check if MiniPay is available
    if (typeof window !== 'undefined') {
      if (window.ethereum?.isMiniPay) {
        initConnection();
      } else {
        // Still initialize if running in development
        initConnection();
      }
    }
  }, []);

  const handleStateChange = useCallback((newState: GameState) => {
    setGameState(newState);
  }, []);

  const handleReset = useCallback(() => {
    // Create a fresh copy of INITIAL_STATE to avoid mutations
    setGameState({
      snake: [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 },
      ],
      food: { x: 15, y: 15 },
      trees: [],
      fence: [],
      score: 0,
      gameOver: false,
      gamePaused: false,
      sunsetMode: false,
      direction: 'right',
      nextDirection: 'right',
      powerups: [],
      particles: [],
    });
  }, []);

  const handleDirectionChange = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    setGameState(prev => ({ ...prev, nextDirection: direction }));
  }, []);

  const handlePauseToggle = useCallback(() => {
    setGameState(prev => ({ ...prev, gamePaused: !prev.gamePaused }));
  }, []);

  return (
    <main className="w-screen h-screen bg-gradient-to-b from-sky-light to-grass overflow-hidden flex items-center justify-center">
      <div className="game-container relative bg-grass rounded-lg shadow-2xl border-8 border-amber-900">
        <GameCanvas
          gameState={gameState}
          onStateChange={handleStateChange}
          sunsetMode={gameState.sunsetMode}
        />
        <GameUI
          gameState={gameState}
          onReset={handleReset}
          isConnected={isConnected}
          onDirectionChange={handleDirectionChange}
          onPauseToggle={handlePauseToggle}
        />
      </div>
    </main>
  );
}
