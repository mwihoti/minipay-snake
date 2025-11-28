# Park Snake - Complete Developer Guide

## 📚 Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Game Mechanics](#game-mechanics)
4. [Celo Integration](#celo-integration)
5. [Development Guide](#development-guide)
6. [Deployment](#deployment)
7. [Advanced Features](#advanced-features)

---

## Project Overview

**Park Snake** is a full-stack Web3 game built for MiniPay on Celo. Players earn cUSD rewards by achieving high scores in a progressive, park-themed snake game.

### Key Stats

- **Target Users**: MiniPay users in Global South
- **Game Time**: 5-15 minutes per session
- **Reward Range**: 0.01 - 100+ cUSD per game
- **Blockchain**: Celo (mainnet/testnet)
- **Wallet**: MiniPay (implicit connection)

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, React 18, TypeScript |
| Styling | Tailwind CSS, custom Canvas |
| Blockchain | Viem, Web3.js, Celo SDK |
| Smart Contract | Solidity, OpenZeppelin |
| Hosting | Vercel/Netlify |
| Audio | Web Audio API |

---

## Architecture

### Directory Structure

```
minipay-snake/
├── app/                          # Next.js app router
│   ├── page.tsx                 # Root game component
│   ├── layout.tsx               # HTML layout
│   └── globals.css              # Global styles
├── components/                   # React components
│   ├── GameCanvas.tsx           # Canvas rendering
│   └── GameUI.tsx               # UI overlay
├── lib/                         # Utilities & logic
│   ├── gameEngine.ts            # Game state machine
│   ├── celoIntegration.ts       # Blockchain RPC calls
│   └── audioManager.ts          # Web Audio API
├── contracts/                    # Smart contracts
│   └── SnakeGameScoreRegistry.sol # On-chain leaderboard
├── public/                       # Static assets
│   └── audio/                   # Sound files (optional)
└── types/                        # TypeScript definitions
    └── ethereum.ts              # Window.ethereum types
```

### Component Flow

```
Home (page.tsx)
├── GameCanvas
│   ├── Parallax Background
│   ├── Snake Rendering
│   ├── Obstacles (Trees, Fence)
│   ├── Food & Powerups
│   ├── Particles
│   └── Game Loop (requestAnimationFrame)
└── GameUI
    ├── Score Display (Wooden Sign)
    ├── Controls Info
    ├── Game Over Screen
    ├── Score Submission
    └── Balance Display
```

### State Management

**Game State** (managed in GameCanvas):

```typescript
interface GameState {
  snake: Position[];           // Head + segments
  food: Position;              // Current food
  trees: Position[];           // Obstacles
  fence: Position[];           // Border segments
  score: number;               // Current points
  gameOver: boolean;           // Game status
  gamePaused: boolean;         // Pause state
  sunsetMode: boolean;         // 1000+ pts mode
  direction: Direction;        // Current direction
  nextDirection: Direction;    // Buffered input
  powerups: Powerup[];         // Active powerups
  particles: Particle[];       // Visual effects
}
```

---

## Game Mechanics

### Core Rules

1. **Movement**: Snake moves continuously in the current direction
2. **Wrapping**: Edges wrap around (no walls initially)
3. **Growth**: Eating food adds a segment
4. **Collision**: Hitting tree or self = game over
5. **Scoring**: +100 pts per food, +50 for powerups

### Progressive Difficulty

| Score | Event | Mechanic |
|-------|-------|----------|
| 0 | Start | Basic 3-segment snake |
| 100 | 1st Food | First tree obstacle spawns |
| 200 | 2nd Food | 2nd tree (odd foods) |
| 500 | Milestone | Fence border appears (5% passable) |
| 1000 | Sunset | Mode unlocked, +50% rewards, faster spawns |

### Powerups

- **Shrink Bird**: Removes 1 segment (except minimum 3)
- **Slowdown**: Temporary speed reduction (visual only)
- **Bonus Apple**: +200 pts instant

**Spawn Rate**: 10% chance every time a tree spawns

### Win Condition

Reach **1000 points** to unlock "Sunset Mode":
- Visual: Day → Sunset color palette
- Gameplay: Obstacles spawn faster
- Reward: +50% cUSD multiplier

---

## Celo Integration

### MiniPay Connection Flow

```
1. App loads
2. Check window.ethereum?.isMiniPay
3. Auto-connect via eth_requestAccounts
4. Get player address
5. Display balance (optional)
6. Ready for gameplay
```

### Score Submission

```typescript
// 1. Player reaches game over
// 2. Score displayed in modal
// 3. Optional: Submit to chain

submitScore(score, address):
  ├─ Calculate reward = score / 100 * 1 cUSD
  ├─ Apply modifiers (sunset +50%)
  ├─ Call contract: submitScore(score, sunsetMode, uniqueId)
  ├─ Contract transfers cUSD to player
  └─ Record on leaderboard
```

### Blockchain Calls

**Using Viem (Web3 library)**:

```typescript
// Get balance
const balance = await publicClient.readContract({
  address: cUSD_ADDRESS,
  abi: stableTokenABI,
  functionName: 'balanceOf',
  args: [playerAddress],
});

// Submit score (via contract)
const hash = await walletClient.sendTransaction({
  to: CONTRACT_ADDRESS,
  data: encodeFunctionData({
    abi: scoreRegistryABI,
    functionName: 'submitScore',
    args: [score, sunsetMode, uniqueId],
  }),
  feeCurrency: cUSD_ADDRESS, // Pay gas in cUSD!
});
```

### Gas & Fees

- **Estimated Gas**: ~100k-150k (score submission)
- **Fee Currency**: cUSD (via fee abstraction)
- **Typical Cost**: ~0.001-0.003 cUSD
- **Speed**: 5-15 seconds (Celo blocks every 5s)

---

## Development Guide

### Local Setup

```bash
# 1. Clone/create project
cd /home/daniel/work/celo/minipay-snake

# 2. Install dependencies
npm install

# 3. Create .env.local
cp .env.example .env.local

# 4. Start dev server
npm run dev

# 5. Open http://localhost:3000
```

### Development Testing

#### Option A: Browser (Local)

```bash
npm run dev
# Open http://localhost:3000 in browser
# Game fully playable without MiniPay
```

#### Option B: MiniPay with ngrok

```bash
# Terminal 1: Start dev server
npm run dev

# Terminal 2: Tunnel to MiniPay
ngrok http 3000
# Copy URL: https://abc123.ngrok.io

# MiniPay app:
# Settings → Developer Settings → Load Test Page
# Paste ngrok URL → Click "Go"
```

### Code Walkthrough

#### Game Loop (`GameCanvas.tsx`)

```typescript
const gameLoop = () => {
  frameCount++;
  
  // Update at fixed interval (every 10 frames ≈ 165ms)
  if (frameCount % speedRef.current === 0) {
    const newState = updateGameState(gameState);
    onStateChange(newState); // Re-render
  }
  
  draw(); // Canvas render (60fps)
  requestAnimationFrame(gameLoop);
};
```

#### Game Update (`gameEngine.ts`)

```typescript
export function updateGameState(state: GameState): GameState {
  // 1. Calculate new head position
  const newHead = calculateNextPosition(state.snake[0], state.direction);
  
  // 2. Check collisions
  if (hitTree(newHead) || hitSelf(newHead)) {
    state.gameOver = true;
    return state;
  }
  
  // 3. Add head, remove tail (or keep if eating)
  state.snake.unshift(newHead);
  if (!ateFood(newHead, state.food)) {
    state.snake.pop();
  }
  
  // 4. Spawn new obstacles
  if (state.score % 100 === 0) {
    spawnTree(state);
  }
  
  // 5. Check sunset unlock
  if (state.score >= 1000 && !state.sunsetMode) {
    state.sunsetMode = true;
  }
  
  return state;
}
```

#### Score Submission (`celoIntegration.ts`)

```typescript
export async function submitScore(
  score: number,
  address: string,
  isTestnet: boolean
): Promise<string | null> {
  // 1. Create wallet client
  const walletClient = createWalletClient({
    chain: isTestnet ? celoSepolia : celo,
    transport: custom(window.ethereum),
  });

  // 2. Prepare transaction
  const reward = score / 100; // 1 cUSD per 100 pts
  
  // 3. Send transaction
  const hash = await walletClient.sendTransaction({
    to: CONTRACT_ADDRESS,
    data: encodeScoreSubmission(score, reward),
    feeCurrency: cUSD_ADDRESS,
  });

  return hash;
}
```

### Adding Features

#### Example: New Powerup Type

1. **Define in `gameEngine.ts`**:
```typescript
type PowerupType = 'shrink' | 'slowdown' | 'bonus' | 'turbo'; // Add turbo

interface Powerup {
  // ...existing fields...
  type: PowerupType;
}
```

2. **Handle logic**:
```typescript
function handlePowerup(state: GameState, powerup: Powerup) {
  switch (powerup.type) {
    case 'turbo':
      speedRef.current = 5; // Double speed
      setTimeout(() => speedRef.current = 10, 5000);
      break;
  }
}
```

3. **Render in canvas**:
```typescript
drawPowerups() {
  // Add case for turbo sprite
}
```

#### Example: Add Sound Effects

```typescript
// lib/audioManager.ts
export class AudioManager {
  playTurbo() {
    this.playTone(1500, 0.15, 0.25); // High-pitched
  }
}

// In gameEngine.ts
if (hitPowerup(powerup.type === 'turbo')) {
  audioManager.playTurbo();
}
```

---

## Deployment

### Pre-Deployment Checklist

- [ ] All tests pass: `npm run test`
- [ ] Build succeeds: `npm run build`
- [ ] Environment variables set
- [ ] Contract deployed to mainnet/testnet
- [ ] Reward pool funded
- [ ] Terms of service created
- [ ] Privacy policy added

### Deploy to Vercel

```bash
npm install -g vercel
vercel login
vercel --prod
```

### Deploy Smart Contract

```bash
# 1. Install Hardhat
npm install --save-dev hardhat

# 2. Initialize project
npx hardhat

# 3. Compile
npx hardhat compile

# 4. Deploy (Celo testnet)
npx hardhat run scripts/deploy.ts --network celoTestnet
```

**Deployment Script** (`scripts/deploy.ts`):

```typescript
async function main() {
  const SnakeRegistry = await ethers.getContractFactory('SnakeGameScoreRegistry');
  const registry = await SnakeRegistry.deploy();
  await registry.deployed();
  
  console.log('Contract deployed to:', registry.address);
  
  // Top up reward pool
  const cUSD = await ethers.getContractAt('IERC20', CUSD_ADDRESS);
  const amount = ethers.utils.parseEther('1000'); // 1000 cUSD
  await cUSD.approve(registry.address, amount);
  await registry.topUpRewardPool(amount);
}

main().catch(console.error);
```

---

## Advanced Features

### Multiplayer Mode (Future)

```typescript
// Leaderboard realtime updates
const leaderboard = await fetch('/api/leaderboard');
const topScores = await leaderboard.json();

// WebSocket for live updates
ws.on('scoreUpdate', (newScore) => {
  updateLeaderboard(newScore);
});
```

### NFT Achievements

```solidity
// Achievement badges
contract SnakeAchievements is ERC721 {
  function awardBadge(address player, string memory badgeType) public {
    // badgeType: "first1000", "sunsetMaster", etc.
    _safeMint(player, tokenId);
  }
}
```

### Advanced AI Opponent

```typescript
// Minimax algorithm for snake AI
function aiMove(snake: Position[], food: Position): Direction {
  const options = getValidMoves(snake);
  return minimax(options, food, depth=3);
}
```

### Mobile Touch Controls

```typescript
// Swipe gesture support
canvas.addEventListener('touchstart', (e) => {
  const touch = e.touches[0];
  trackTouch(touch.clientX, touch.clientY);
});

canvas.addEventListener('touchend', (e) => {
  const direction = getSwipeDirection();
  setGameDirection(direction);
});
```

---

## Performance Tips

### Canvas Optimization

- Use `ctx.getImageData()` and `ctx.putImageData()` for pixel manipulation
- Cache frequently used paths as `Path2D`
- Use `requestAnimationFrame` for 60fps cap
- Particle limit: 50 max to avoid jank

### React Performance

- Memoize heavy components: `React.memo(GameCanvas)`
- Use `useCallback` for event handlers
- Lazy load remote scripts
- Profile with DevTools: `npm run dev -- --turbo`

### Network Performance

- RPC endpoints are cached
- Use Celo's public RPC (no auth needed)
- Batch transactions where possible
- Consider L2 solutions (Celo is already cheap!)

---

## Debugging

### Browser Console

```javascript
// Check MiniPay detection
window.ethereum?.isMiniPay

// Get player address
window.ethereum.request({ method: 'eth_requestAccounts' })

// Check game state
window.gameState

// Simulate score
window.submitScore(500)
```

### Network Inspector

- Check RPC calls in Network tab
- Monitor transaction status
- Check gas prices: `eth_gasPrice`

### Errors

```
Error: "window.ethereum is undefined"
→ Not running in browser or MiniPay not installed

Error: "Insufficient balance"
→ Player doesn't have enough cUSD

Error: "Transaction reverted"
→ Check contract for revert reason
```

---

## Resources

- **Celo Docs**: https://docs.celo.org
- **MiniPay**: https://www.opera.com/products/minipay
- **Viem**: https://viem.sh
- **Next.js**: https://nextjs.org
- **Tailwind**: https://tailwindcss.com
- **Solidity**: https://docs.soliditylang.org

---

**Happy building! 🎮🌳**

For questions, reach out to the Celo community on Discord: https://discord.gg/celo
