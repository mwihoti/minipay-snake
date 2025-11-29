# Park Snake - MiniPay Celo Game

A progressive, park-themed snake game built for MiniPay on the Celo blockchain. Earn cUSD rewards by reaching high scores!

## 🌳 Features

### Game Mechanics
- **Progressive Park Mechanics**
  - Trees spawn like walls (every odd food eaten)
  - 10% chance for bonus apple powerups
  - Fence segments with 5% passable "rust" gaps (risk-reward)
  - Bird powerup shrinks snake 1 segment
  - Win condition: 1000pts unlocks "sunset mode"

### Aesthetic Layers
- **Parallax Background**: Scrolling grass/sky with distant trees
- **Organic Snake**: Segmented vine/worm with flower head
- **Particle Effects**: Leaf bursts on eat/crash, pollen trails
- **Day/Night Cycle**: Sunset mode with fading light effects
- **Retro UI**: Wooden sign score display, park bench pause menu

### Celo Integration
- **MiniPay Wallet**: Implicit connection, no explicit wallet button needed
- **Score Rewards**: Automatic cUSD payout (1 cUSD per 100 points)
- **Leaderboard**: On-chain score tracking
- **cUSD Balance**: Live balance display in game UI

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MiniPay app (iOS/Android) or development wallet
- ngrok for local testing

### Installation

```bash
# Clone the repository
cd /home/daniel/work/celo/minipay-snake

# Install dependencies
npm install

# Start development server
npm run dev
```

### Local Testing with MiniPay

1. **Start ngrok tunnel**
   ```bash
   ngrok http 3000
   ```

2. **Enable MiniPay Developer Mode**
   - Open MiniPay app → Settings → About
   - Tap Version number repeatedly until confirmation
   - Return to Settings → Developer Settings
   - Enable Developer Mode and toggle "Use Testnet"

3. **Load Test Page**
   - Developer Settings → Load Test Page
   - Enter ngrok URL: `https://your-ngrok-url.ngrok.io`
   - Click "Go" to launch the game

### Production Deployment

```bash
# Build for production
npm run build

# Start production server
npm start
```

Deploy to Vercel, Netlify, or your hosting provider.

## 🎮 Controls

- **Arrow Keys** or **WASD**: Move snake
- **Space**: Pause/Resume game
- **Submit Score**: Register score on Celo testnet/mainnet

## 📊 Game Progression

| Score | Milestone | Effect |
|-------|-----------|--------|
| 0-100 | Start | Basic gameplay |
| 100+ | First Tree | Obstacle added |
| 500+ | Fence Begins | Border with gaps |
| 1000 | Sunset Mode | Enhanced aesthetics, faster spawns, +50% rewards |
| 1000+ | Powerups Active | Bird shrink, slowdown, bonus apples |

## 💰 Reward System

- **Level Rewards**: 0.3 CELO per level (1 level = 1000 points)
- **Maximum Levels**: 10 levels total
- **Total Potential Earnings**: 3.0 CELO
- **Gas Fee**: Covered by MiniPay fee abstraction

## 🏗️ Architecture

```
minipay-snake/
├── app/
│   ├── page.tsx           # Main game component
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Tailwind CSS
├── components/
│   ├── GameCanvas.tsx     # Canvas rendering and game loop
│   └── GameUI.tsx         # Score display, controls, game over screen
├── lib/
│   ├── gameEngine.ts      # Game state and mechanics
│   ├── celoIntegration.ts # MiniPay/Celo blockchain integration
│   └── audioManager.ts    # Web Audio API sound effects
├── public/
│   └── audio/             # SFX (optional)
├── package.json
├── tsconfig.json
└── next.config.js
```

## 🎨 Aesthetic Details

### Colors
- **Grass Green**: `#4a7c2b` (default), `#654321` (sunset)
- **Sky Blue**: `#87ceeb` (default), `#ff6b35` (sunset)
- **Snake Green**: `#228b22` (head), `#32cd32` (body)
- **UI Wood**: `#8b6f47` (signs), `#8b4513` (trees)

### Animations
- **Sway**: Tree bob animation (3s cycle)
- **Drift**: Parallax cloud movement (20s)
- **Pulse Glow**: Powerup pulse effect (2s)
- **Fall**: Particle gravity and rotation

### Audio
- **Move**: 400Hz chirp (50ms)
- **Eat**: 600Hz → 800Hz ascending (100ms total)
- **Collision**: 200Hz deep tone (300ms)
- **Powerup**: 1000Hz → 1200Hz (200ms total)
- **Game Over**: 300Hz → 200Hz (600ms total)

## 🔐 Smart Contracts

### Score Registry Contract (Future)
```solidity
contract SnakeScoreRegistry {
  mapping(address => uint256) public highScores;
  mapping(address => uint256) public totalRewards;
  
  function submitScore(uint256 score) public;
  function claimReward(uint256 score) public;
}
```

## 🧪 Testing

### Test Score Submission
```bash
# In browser console
window.ethereum.request({
  method: 'eth_requestAccounts'
});

// Then use the game's score submission button
```

### Check Balance
```bash
# Via MiniPay app or:
curl -X POST https://forno.celo.org \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_getBalance","params":["0x...","latest"],"id":1}'
```

## 📱 MiniPay Compatibility

- ✅ Uses `window.ethereum.isMiniPay` detection
- ✅ Implicit wallet connection (no connect button needed)
- ✅ Fee abstraction via viem/wagmi
- ✅ cUSD payment support
- ✅ Mobile-first responsive design
- ✅ Touch-friendly UI (future: swipe controls)

## 🐛 Troubleshooting

### MiniPay not detected
- Ensure you're using the latest MiniPay app
- Check that `window.ethereum` is available
- Refresh page after opening in MiniPay

### ngrok URL expires
- ngrok provides new URL on each restart
- Update MiniPay Developer Settings with new URL
- Use ngrok's auth token for static URLs (premium)

### Transactions fail
- Ensure testnet CELO tokens from [faucet](https://faucet.celo.org)
- Swap for cUSD in [mento app](https://app.mento.org/)
- Check gas balance with `estimateGasFee()`

## 📚 Resources

- [MiniPay Docs](https://docs.celo.org/build-on-celo/build-on-minipay)
- [Celo Composer](https://github.com/celo-org/celo-composer)
- [Viem Documentation](https://viem.sh)
- [Celo Faucet](https://faucet.celo.org)

## 📄 License

MIT - See LICENSE file

## 🤝 Contributing

PRs welcome! Areas for improvement:
- [ ] Smart contract for on-chain leaderboard
- [ ] Multiplayer mode via websockets
- [ ] NFT achievement badges
- [ ] Advanced pixel art sprites (KayKit Forest pack)
- [ ] Mobile touch controls (swipe/tap)
- [ ] Sound effects library (zapsplat)

---

**Built with ❤️ for Celo and MiniPay**
