# Snake Game Controls Guide

## How to Move the Snake

### Desktop / Web
- **Arrow Keys**: ↑ ↓ ← → to move up, down, left, right
- **WASD Keys**: W A S D for movement
- **Spacebar**: Pause/Resume the game

### Mobile / Touch
- **Swipe Gestures**: Swipe your finger in any direction to move the snake
  - Swipe up → move up
  - Swipe down → move down
  - Swipe left → move left
  - Swipe right → move right
  - Minimum swipe distance: 30 pixels

- **On-Screen D-Pad** (visible on mobile):
  - Tap the arrow buttons to move in that direction
  - ↑ ↓ ← → buttons arranged in a D-pad layout
  - Located in the bottom-left of the screen

- **Pause Button**: Tap the "PAUSE" button in the bottom-right to pause/resume

## Gameplay Mechanics

### Eating Targets
- Guide the snake to the **green apple** 🍎 to grow
- Each food eaten:
  - **+100 points**
  - **Snake grows by 1 segment**
  - New food spawns at a random location

### Obstacles
- **Trees** 🌳: Randomly spawn as the score increases
  - Hit a tree = Game Over
  - Progressive difficulty: more trees appear with higher scores

- **Fences** 🚧: Appear at 500+ points
  - Metal barriers that end the game on collision

- **Powerups** ✨ (Optional challenges):
  - **Gold Star**: +50 bonus points
  - **Shrink**: Removes one segment (helpful when trapped)
  - **Slowdown**: Temporarily reduces speed (good for recovery)

### Progression Levels

#### Park Mode (0-999 points)
- Green grass background
- Progressive tree obstacles
- Calm paced gameplay

#### Sunset Mode (1000+ points)
- Unlocks at 1000 points
- Beautiful orange/sunset color scheme
- Slightly faster gameplay (+2 speed)
- 50% bonus reward multiplier for submitted scores

## Strategy Tips

1. **Plan Ahead**: Think about where the snake will grow, not just the next move
2. **Avoid Tight Corners**: Leave yourself escape routes
3. **Use Edges Wisely**: The snake wraps around the screen edges
4. **Watch the Snake Length**: Keep track of how long you are - longer snakes need more room
5. **Collect Powerups**: Use the shrink powerup strategically when trapped
6. **Reach 1000 Points**: Unlock the beautiful Sunset Mode with bonus rewards

## Tips for Mobile Players

- **Larger Swipes Work Better**: Make exaggerated swipe movements for reliable input
- **Use D-Pad Buttons for Precision**: Buttons are more reliable than swiping for quick turns
- **Keep Your Screen Unobstructed**: The game fills the screen - make sure nothing is covering it
- **Portrait or Landscape**: Works great in both orientations!

## Scoring & Rewards (Celo Integration)

- Scores can be submitted to the blockchain (if MiniPay is connected)
- Base reward: `score / 100` cUSD
- Sunset Mode bonus: +50% of base reward
- Example: 2000 points = 20 cUSD base + 10 cUSD sunset bonus = 30 cUSD

---

**Enjoy the game! 🎮🌳**
