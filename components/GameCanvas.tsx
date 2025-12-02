'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  GameState,
  INITIAL_STATE,
  GRID_SIZE,
  CELL_SIZE,
  updateGameState,
  Position,
} from '@/lib/gameEngine';
import { audioManager } from '@/lib/audioManager';

interface CanvasProps {
  gameState: GameState;
  onStateChange: (state: GameState) => void;
  sunsetMode: boolean;
}

export const GameCanvas: React.FC<CanvasProps> = ({ gameState, onStateChange, sunsetMode }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLoopRef = useRef<number | null>(null);
  const speedRef = useRef(10);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const gameStateRef = useRef<GameState>(gameState);
  const onStateChangeRef = useRef(onStateChange);

  // Keep refs in sync with props
  useEffect(() => {
    gameStateRef.current = gameState;
    onStateChangeRef.current = onStateChange;
  }, [gameState, onStateChange]);

  // Adjust speed based on sunset mode
  useEffect(() => {
    speedRef.current = sunsetMode ? 8 : 10;
  }, [sunsetMode]);

  // Handle touch controls
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;

    const minSwipeDistance = 30;
    const newState = { ...gameState };

    // Determine direction based on swipe
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal swipe
      if (deltaX > minSwipeDistance && gameState.direction !== 'left') {
        newState.nextDirection = 'right';
      } else if (deltaX < -minSwipeDistance && gameState.direction !== 'right') {
        newState.nextDirection = 'left';
      }
    } else {
      // Vertical swipe
      if (deltaY > minSwipeDistance && gameState.direction !== 'up') {
        newState.nextDirection = 'down';
      } else if (deltaY < -minSwipeDistance && gameState.direction !== 'down') {
        newState.nextDirection = 'up';
      }
    }

    onStateChange(newState);
    touchStartRef.current = null;
  };

  // Draw functions
  const drawParallaxBackground = (ctx: CanvasContext): void => {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;

    // Sky gradient
    const skyGradient = ctx.createLinearGradient(0, 0, 0, height / 2);
    if (sunsetMode) {
      skyGradient.addColorStop(0, '#ff6b35');
      skyGradient.addColorStop(1, '#ff9e64');
    } else {
      skyGradient.addColorStop(0, '#87ceeb');
      skyGradient.addColorStop(1, '#e0f6ff');
    }
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, width, height / 2);

    // Grass gradient
    const grassGradient = ctx.createLinearGradient(0, height / 2, 0, height);
    if (sunsetMode) {
      grassGradient.addColorStop(0, '#8b4513');
      grassGradient.addColorStop(1, '#654321');
    } else {
      grassGradient.addColorStop(0, '#90ee90');
      grassGradient.addColorStop(1, '#4a7c2b');
    }
    ctx.fillStyle = grassGradient;
    ctx.fillRect(0, height / 2, width, height / 2);

    // Distant trees (parallax effect)
    ctx.fillStyle = sunsetMode ? '#8b2e73' : '#2d5a1f';
    const treePositions = [
      { x: 100, y: 120, size: 30 },
      { x: 300, y: 100, size: 40 },
      { x: 500, y: 130, size: 25 },
      { x: 700, y: 110, size: 35 },
    ];

    treePositions.forEach(tree => {
      ctx.fillRect(tree.x, tree.y, tree.size / 2, tree.size);
      ctx.fillRect(tree.x - tree.size / 2, tree.y - tree.size / 2, tree.size, tree.size / 1.5);
    });
  };

  const drawSnake = (ctx: CanvasContext, snake: Position[]): void => {
    snake.forEach((segment, index) => {
      const x = segment.x * CELL_SIZE;
      const y = segment.y * CELL_SIZE;

      if (index === 0) {
        // Head with flower
        ctx.fillStyle = '#228b22';
        ctx.fillRect(x + 2, y + 2, CELL_SIZE - 4, CELL_SIZE - 4);
        // Flower eyes
        ctx.fillStyle = '#ffff00';
        ctx.fillRect(x + 4, y + 5, 3, 3);
        ctx.fillRect(x + CELL_SIZE - 7, y + 5, 3, 3);
      } else {
        // Body segments - vine-like
        ctx.fillStyle = index % 2 === 0 ? '#32cd32' : '#3cb371';
        ctx.fillRect(x + 3, y + 3, CELL_SIZE - 6, CELL_SIZE - 6);
        // Fading trail effect
        ctx.globalAlpha = 1 - index / snake.length;
        ctx.fillStyle = '#90ee90';
        ctx.fillRect(x + 2, y + 2, CELL_SIZE - 4, CELL_SIZE - 4);
        ctx.globalAlpha = 1;
      }
    });
  };

  const drawFood = (ctx: CanvasContext, food: Position): void => {
    const x = food.x * CELL_SIZE;
    const y = food.y * CELL_SIZE;

    // Sandwich sprite (simple representation)
    ctx.fillStyle = '#d2691e';
    ctx.fillRect(x + 2, y + 8, CELL_SIZE - 4, 4);
    ctx.fillStyle = '#ffd700';
    ctx.fillRect(x + 3, y + 7, CELL_SIZE - 6, 2);
    ctx.fillStyle = '#d2691e';
    ctx.fillRect(x + 2, y + 3, CELL_SIZE - 4, 4);
  };

  const drawTrees = (ctx: CanvasContext, trees: Position[]): void => {
    trees.forEach(tree => {
      const x = tree.x * CELL_SIZE;
      const y = tree.y * CELL_SIZE;

      // Tree trunk
      ctx.fillStyle = '#8b4513';
      ctx.fillRect(x + 6, y + 8, 8, 12);

      // Tree canopy
      ctx.fillStyle = '#228b22';
      ctx.beginPath();
      ctx.moveTo(x + CELL_SIZE / 2, y + 2);
      ctx.lineTo(x + CELL_SIZE - 2, y + 10);
      ctx.lineTo(x + 2, y + 10);
      ctx.closePath();
      ctx.fill();

      // Sway animation indicator
      ctx.globalAlpha = 0.3;
      ctx.fillStyle = '#90ee90';
      ctx.fillRect(x + 4, y + 9, 12, 2);
      ctx.globalAlpha = 1;
    });
  };

  const drawFence = (ctx: CanvasContext, fence: Position[]): void => {
    fence.forEach(segment => {
      const x = segment.x * CELL_SIZE;
      const y = segment.y * CELL_SIZE;

      ctx.fillStyle = '#8b6914';
      ctx.fillRect(x + 2, y + 2, CELL_SIZE - 4, CELL_SIZE - 4);

      // Rust effect (passable segments)
      if (Math.random() < 0.05) {
        ctx.fillStyle = '#c85a17';
        ctx.fillRect(x + 5, y + 5, CELL_SIZE - 10, CELL_SIZE - 10);
      }
    });
  };

  const drawPowerups = (ctx: CanvasContext, powerups: GameState['powerups']): void => {
    powerups.forEach(powerup => {
      const x = powerup.position.x * CELL_SIZE;
      const y = powerup.position.y * CELL_SIZE;

      ctx.fillStyle = powerup.type === 'shrink' ? '#ff6b35' : '#ffd700';
      ctx.beginPath();
      ctx.arc(x + CELL_SIZE / 2, y + CELL_SIZE / 2, 5, 0, Math.PI * 2);
      ctx.fill();

      // Pulsing glow
      const pulse = Math.sin(Date.now() / 200) * 2 + 1;
      ctx.strokeStyle = ctx.fillStyle;
      ctx.lineWidth = pulse;
      ctx.stroke();
    });
  };

  const drawParticles = (ctx: CanvasContext, particles: GameState['particles']): void => {
    particles.forEach(particle => {
      const alpha = particle.life / 40;
      ctx.globalAlpha = alpha;

      if (particle.type === 'leaf') {
        ctx.fillStyle = '#90ee90';
        ctx.fillRect(particle.x - 2, particle.y - 2, 4, 4);
      } else if (particle.type === 'crunch') {
        ctx.fillStyle = '#ffd700';
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, 2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
    });
  };

  const draw = (): void => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const currentState = gameStateRef.current;

    // Clear and draw background
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawParallaxBackground(ctx);

    // Draw game elements
    drawFence(ctx, currentState.fence);
    drawTrees(ctx, currentState.trees);
    drawFood(ctx, currentState.food);
    drawPowerups(ctx, currentState.powerups);
    drawSnake(ctx, currentState.snake);
    drawParticles(ctx, currentState.particles);

    // Sunset overlay
    if (currentState.sunsetMode) {
      const radialGradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        Math.max(canvas.width, canvas.height)
      );
      radialGradient.addColorStop(0, 'rgba(255, 107, 53, 0)');
      radialGradient.addColorStop(1, 'rgba(139, 46, 115, 0.15)');
      ctx.fillStyle = radialGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  };

  // Game loop
  useEffect(() => {
    let frameCount = 0;

    const gameLoop = () => {
      const currentState = gameStateRef.current;
      frameCount++;

      // Only update game state if game has started
      if (currentState.gameStarted && frameCount % speedRef.current === 0) {
        const newState = updateGameState(currentState);

        if (newState.gameOver && !currentState.gameOver) {
          audioManager.playGameOver();
        } else if (newState.sunsetMode && !currentState.sunsetMode) {
          audioManager.playSunsetUnlock();
        }

        onStateChangeRef.current(newState);
      }

      // Always draw (to show initial state)
      draw();
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, []); // Empty dependency array - only run once!

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const currentState = gameStateRef.current;
      const newState = { ...currentState };

      // Start game on any arrow key or WASD if not started
      if (!currentState.gameStarted && !currentState.gameOver) {
        if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'w', 'a', 's', 'd'].includes(e.key.toLowerCase())) {
          newState.gameStarted = true;
        }
      }

      switch (e.key.toLowerCase()) {
        case 'arrowup':
        case 'w':
          if (currentState.direction !== 'down') newState.nextDirection = 'up';
          e.preventDefault();
          break;
        case 'arrowdown':
        case 's':
          if (currentState.direction !== 'up') newState.nextDirection = 'down';
          e.preventDefault();
          break;
        case 'arrowleft':
        case 'a':
          if (currentState.direction !== 'right') newState.nextDirection = 'left';
          e.preventDefault();
          break;
        case 'arrowright':
        case 'd':
          if (currentState.direction !== 'left') newState.nextDirection = 'right';
          e.preventDefault();
          break;
        case ' ':
          newState.gamePaused = !currentState.gamePaused;
          e.preventDefault();
          break;
      }

      onStateChangeRef.current(newState);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []); // Empty dependency array - only run once!

  // Set canvas size
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = GRID_SIZE * CELL_SIZE;
      canvas.height = GRID_SIZE * CELL_SIZE;
    }
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="game-container"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    />
  );
};

type CanvasContext = CanvasRenderingContext2D;
