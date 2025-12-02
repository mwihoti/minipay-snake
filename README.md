# 🐍 Park Snake - MiniPay Play-to-Earn Game

A progressive, park-themed snake game built for MiniPay on the Celo blockchain. Earn **CELO rewards** by reaching level milestones!

Deployed Link: https://minipay-snake.vercel.app 
## ✨ Features

### 🎮 Game Mechanics
- **Progressive Difficulty**
  - Trees spawn as obstacles every 2nd food eaten (scores: 200, 400, 600...)
  - Fence appears at 500 points with 5% passable gaps
  - 10% chance for powerup spawns (shrink, slowdown, bonus)
  - **Sunset Mode** unlocks at 1,000 points with 50% reward bonus
  
- **Scoring System**
  - Food: +100 points
  - Shrink powerup: +50 points  
  - Slowdown powerup: +25 points
  - Bonus powerup: +200 points

### 🎨 Visual Features
- **Parallax Background**: Dynamic grass/sky with distant trees
- **Snake Design**: Segmented vine body with flower head
- **Particle Effects**: Leaf bursts on eat/crash events
- **Day/Night Cycle**: Sunset mode transforms the park aesthetics
- **UI Design**: Wooden sign displays and park-themed interface

### ⛓️ Blockchain Integration
- **Network**: Celo Sepolia Testnet (Chain ID: 44787)
- **Tokens**: 
  - cUSD (`0x86A37B6CA4F0123b643F785385eb0860D5ee810d`)
  - CELO (`0x471ECe3750da237F93b8E339c536aB5FF1D8235B`)
- **Smart Contracts**:
  - SnakeGameRewards: `0x9C1883C198feB1a02b7e5a410Fe72Ff4E4951a1f` (cUSD - inactive)
  - CeloTreasury: `0x4E3dA7A94264AfA1b2C4f467D25716E36C6a41c9` (CELO - active)
- **MiniPay Compatible**: Auto-connect, fee abstraction, mobile-optimized
- **Wallet Support**: MiniPay, MetaMask, Rainbow Kit integration

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- MiniPay app (for mobile testing) or MetaMask/compatible wallet
- Celo Sepolia testnet tokens (CELO + cUSD)
- ngrok (for local MiniPay testing)

### Installation

```bash
# Clone the repository
git clone https://github.com/mwihoti/minipay-snake.git
cd minipay-snake

# Install dependencies
npm install

# Create environment file
cp .env.local.example .env.local

# Edit .env.local with your values:
# NEXT_PUBLIC_REWARDS_CONTRACT=0x9C1883C198feB1a02b7e5a410Fe72Ff4E4951a1f
# NEXT_PUBLIC_TREASURY_CONTRACT=0x4E3dA7A94264AfA1b2C4f467D25716E36C6a41c9
# NEXT_PUBLIC_NETWORK=testnet

# Start development server
npm run dev
```

The game will be available at `http://localhost:3000`

### Testing with MiniPay

1. **Start ngrok tunnel**
   ```bash
   ngrok http 3000
   ```

2. **Enable MiniPay Developer Mode**
   - Open MiniPay app → Settings → About
   - Tap version number 7 times to unlock developer mode
   - Go to Developer Settings
   - Enable "Developer Mode" and "Use Testnet"

3. **Load the Game**
   - In Developer Settings → Load Test Page
   - Enter your ngrok URL: `https://your-id.ngrok-free.app`
   - The game will auto-connect your MiniPay wallet

### Deploy to Production

```bash
# Build for production
npm run build

# Start production server
npm start

# Or deploy to Vercel (recommended)
vercel --prod
```

### Smart Contract Deployment (Optional)

```bash
# Deploy contracts to Celo Sepolia
npx hardhat run scripts/deploy-treasury.mjs --network celoSepolia

# Fund the treasury with CELO
node scripts/fund-treasury.mjs

# Verify on Celoscan
npx hardhat verify --network celoSepolia <CONTRACT_ADDRESS> <CONSTRUCTOR_ARGS>
```

## 🎮 How to Play

### Controls
- **Arrow Keys** or **WASD**: Move snake (up/down/left/right)
- **Touch/Swipe**: Mobile controls (swipe in direction)
- **Space**: Pause/Resume game
- **ESC**: Open stats modal

### Gameplay Tips
- Collect food (sandwiches) to grow and score points
- Avoid hitting trees (obstacles) or yourself
- Grab powerups for bonus points and special effects
- Reach 1,000 points to unlock Sunset Mode (50% bonus)
- Submit your score when game ends to claim CELO rewards

## 📊 Game Progression

| Score Range | Features | Obstacles |
|-------------|----------|-----------|
| 0-200 | Basic gameplay | None |
| 200-500 | Trees start spawning | 1-2 trees |
| 500-1000 | Fence appears | 3-5 trees + fence |
| 1000+ | **Sunset Mode unlocked** | 5+ trees + fence |
| 2000+ | Master difficulty | 10+ trees + complex fence |

### Powerups
- 🔴 **Shrink**: Remove one tail segment (+50 pts)
- 🟡 **Slowdown**: Temporary speed reduction (+25 pts)  
- 🟢 **Bonus**: Extra points (+200 pts)
- Duration: 10 seconds before expiring

## 💰 Reward System

### Level-Based CELO Rewards (Active)
The game uses a **milestone reward system** where you earn CELO for reaching level thresholds:

- **Level Calculation**: Score ÷ 1,000 = Level
- **Reward per Level**: 0.3 CELO
- **Maximum Levels**: 10 (10,000 points)
- **Total Potential**: 3.0 CELO

**Level Breakdown:**
| Level | Score Required | CELO Earned | Cumulative |
|-------|----------------|-------------|------------|
| 1 | 1,000 | 0.3 CELO | 0.3 CELO |
| 2 | 2,000 | 0.3 CELO | 0.6 CELO |
| 3 | 3,000 | 0.3 CELO | 0.9 CELO |
| 5 | 5,000 | 0.3 CELO | 1.5 CELO |
| 10 | 10,000 | 0.3 CELO | 3.0 CELO |

### How to Claim Rewards
1. Play the game and reach a level milestone (1000, 2000, 3000...)
2. When game ends, the **Level Milestone** panel appears
3. Click "Claim Level X" button to submit transaction
4. CELO is sent directly to your wallet
5. Track claimed levels in the progress tracker

### Score-Based cUSD Rewards (Inactive)
A secondary reward system exists in the smart contracts but is currently disabled:
- Formula: `score × 0.01 cUSD × land_multiplier × sunset_bonus`
- Land multipliers: 1.0x (free), 1.5x (paid lands)
- Sunset bonus: 1.5x when active
- Maximum: 100 cUSD per game

> **Note**: This system is not currently active in the UI. Only level-based CELO rewards are distributed.

## 🏗️ Project Structure

```
minipay-snake/
├── app/                      # Next.js 14 App Router
│   ├── page.tsx             # Main game page
│   ├── layout.tsx           # Root layout with providers
│   └── globals.css          # Global styles (Tailwind)
│
├── components/              # React components
│   ├── GameCanvas.tsx       # Game rendering & loop
│   ├── GameUI.tsx           # HUD, score, controls
│   ├── LevelMilestone.tsx   # Level rewards UI (active)
│   ├── RewardsSubmitter.tsx # cUSD rewards UI (disabled)
│   ├── LandsManager.tsx     # Land purchase system
│   ├── PlayerStats.tsx      # Player statistics
│   ├── WalletConnect.tsx    # Wallet connection
│   └── StatsModal.tsx       # Achievement modal
│
├── lib/                     # Core game logic
│   ├── gameEngine.ts        # Game state & mechanics
│   ├── celoIntegration.ts   # Celo blockchain calls
│   ├── treasuryIntegration.ts # Treasury contract interaction
│   ├── onChainStats.ts      # Blockchain event tracking
│   ├── minipayUtils.ts      # MiniPay compatibility
│   └── audioManager.ts      # Sound effects
│
├── contracts/               # Solidity smart contracts
│   ├── SnakeGameRewards.sol # cUSD reward contract
│   └── CeloTreasury.sol     # CELO level rewards
│
├── scripts/                 # Deployment scripts
│   ├── deploy-treasury.mjs  # Deploy treasury
│   ├── fund-treasury.mjs    # Fund with CELO
│   └── deploy.mjs           # Deploy rewards contract
│
├── artifacts/               # Compiled contracts
├── hardhat.config.js        # Hardhat configuration
├── wagmi.config.ts          # Wagmi/RainbowKit config
├── package.json
└── .env.local               # Environment variables
```

## 🔧 Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Blockchain**: 
  - Wagmi v2 + Viem v2 (Ethereum interactions)
  - Ethers.js v6 (Contract calls)
  - RainbowKit v2 (Wallet UI)
- **Smart Contracts**: Solidity 0.8.19, Hardhat, OpenZeppelin
- **Network**: Celo Sepolia Testnet
- **Wallet**: MiniPay, MetaMask, Rainbow compatible

## 🎨 Visual Design

### Color Palette
- **Park Mode (Day)**
  - Sky: `#87ceeb` → `#e0f6ff` (gradient)
  - Grass: `#90ee90` → `#4a7c2b` (gradient)
  - Snake: `#228b22` (head), `#32cd32` / `#3cb371` (body)
  - Trees: `#8b4513` (trunk), `#228b22` (canopy)

- **Sunset Mode (Evening)**  
  - Sky: `#ff6b35` → `#ff9e64` (orange gradient)
  - Grass: `#8b4513` → `#654321` (brown gradient)
  - Trees: `#8b2e73` (purple tint)

- **UI Elements**
  - Wood signs: `#8b6f47`
  - Powerups: `#ff6b35` (shrink), `#ffd700` (bonus)
  - Text: `#ffff00` (highlights), `#ffffff` (primary)

### Particle Effects
- **Food Eat**: 8 particles burst radially with gravity
- **Crash**: 16 particles explosive spread
- **Animation**: Fade out over 30-40 frames
- **Types**: Leaf, pollen, crunch effects

### Animations
- Tree sway simulation (visual only)
- Parallax background layers
- Snake segment fade trail
- Powerup pulse glow

## 🔐 Smart Contracts

### CeloTreasury (Active)
**Address**: `0x4E3dA7A94264AfA1b2C4f467D25716E36C6a41c9`  
**Network**: Celo Sepolia Testnet  
**Purpose**: Level-based CELO reward distribution

**Key Functions:**
```solidity
// Submit score and claim level rewards
function submitScoreWithLevels(uint256 score) external

// Query player progress
function getPlayerProgress(address player) external view 
  returns (PlayerProgress memory)

// Calculate level from score  
function calculateLevel(uint256 score) external view returns (uint256)

// Owner: Fund treasury with CELO
function fundTreasury() external payable
```

**Configuration:**
- `rewardPerLevel`: 0.3 CELO
- `levelThreshold`: 1000 points per level
- Tracks `currentLevel`, `totalEarned`, `lastRewardedLevel`

### SnakeGameRewards (Inactive)
**Address**: `0x9C1883C198feB1a02b7e5a410Fe72Ff4E4951a1f`  
**Network**: Celo Sepolia Testnet  
**Purpose**: Score-based cUSD rewards (currently disabled in UI)

**Key Functions:**
```solidity
// Submit score for cUSD rewards
function submitScore(uint256 score, bool sunsetMode) external

// Purchase premium lands
function purchaseLand(uint256 landId) external

// Activate land for gameplay
function activateLand(uint256 landId) external

// Get player statistics
function getPlayerStats(address player) external view
```

**Configuration:**
- `rewardPerPoint`: 0.01 cUSD
- `sunsetModeBonus`: 50% (1.5x multiplier)
- `minScoreToEarn`: 100 points
- `maxRewardPerGame`: 100 cUSD
- Land multipliers: 100 (1.0x), 150 (1.5x)

**Land System:**
1. Sunny Park (Free, 1.0x multiplier)
2. Enchanted Forest (10 cUSD, 1.5x multiplier)

### Security Features
- ✅ ReentrancyGuard on reward functions
- ✅ Ownable pattern for admin operations
- ✅ Transfer success validation
- ✅ Score caps and minimum thresholds
- ⚠️ No score verification (client-side trust)

### Deployed on Celoscan
- [View CeloTreasury](https://sepolia.celoscan.io/address/0x4E3dA7A94264AfA1b2C4f467D25716E36C6a41c9)
- [View SnakeGameRewards](https://sepolia.celoscan.io/address/0x9C1883C198feB1a02b7e5a410Fe72Ff4E4951a1f)

## 🧪 Testing & Development

### Local Development
```bash
# Start development server
npm run dev

# Run with ngrok for MiniPay testing
ngrok http 3000
```

### Smart Contract Testing
```bash
# Compile contracts
npx hardhat compile

# Deploy to Celo Sepolia
npx hardhat run scripts/deploy-treasury.mjs --network celoSepolia

# Fund treasury
node scripts/fund-treasury.mjs

# Check contract balance
node check-contract-balance.mjs

# Verify on Celoscan
npx hardhat verify --network celoSepolia <ADDRESS> <CONSTRUCTOR_ARGS>
```

### Get Testnet Tokens
1. **CELO Tokens**: [Celo Faucet](https://faucet.celo.org/alfajores)
2. **cUSD Tokens**: Swap CELO → cUSD on [Mento](https://app.mento.org)
3. **Alternative**: Use [Ubeswap](https://app.ubeswap.org)

### Testing Checklist
- [ ] Wallet connects (MiniPay/MetaMask)
- [ ] Game renders and plays correctly
- [ ] Score increases on food collection
- [ ] Trees spawn at correct intervals
- [ ] Sunset mode unlocks at 1000 points
- [ ] Level milestone tracker shows progress
- [ ] Claim button appears for unclaimed levels
- [ ] Transaction submits successfully
- [ ] CELO received in wallet
- [ ] Stats persist in localStorage
- [ ] Mobile touch controls work

## 📱 MiniPay Integration

### Features
- ✅ **Auto-detection**: Checks `window.ethereum.isMiniPay`
- ✅ **Auto-connect**: Automatically connects wallet on load
- ✅ **Fee Abstraction**: Uses cUSD for gas fees (no CELO needed)
- ✅ **Legacy Transactions**: Compatible with MiniPay transaction format
- ✅ **Mobile-Optimized**: Touch controls and responsive design
- ✅ **Simplified UI**: Streamlined interface inside MiniPay

### MiniPay-Specific Configuration
```typescript
// Fee currency for gas payment
feeCurrency: '0x86a37b6Ca4f0123b643f785385Eb0860D5EE810d' // cUSD

// Legacy transaction format (no EIP-1559)
delete transaction.maxFeePerGas
delete transaction.maxPriorityFeePerGas
```

### Developer Mode Setup
1. Open MiniPay → Settings → About
2. Tap version number 7 times
3. Enable Developer Mode in settings
4. Toggle "Use Testnet" for Celo Sepolia
5. Load Test Page → Enter ngrok URL

### Best Practices
- Always test with ngrok before production
- Use HTTPS URLs (ngrok provides this)
- Keep development builds for easier debugging
- Monitor contract balances to avoid empty treasury

## 🐛 Troubleshooting

### Wallet Connection Issues
**MiniPay not detected:**
- Ensure you're using the latest MiniPay app version
- Check that `window.ethereum` is available in console
- Refresh page after opening in MiniPay
- Verify Developer Mode is enabled

**MetaMask issues:**
- Add Celo Sepolia network manually if needed
- Chain ID: 44787
- RPC: https://alfajores-forno.celo-testnet.org

### Transaction Failures
**"Insufficient funds":**
- Get testnet CELO from [faucet](https://faucet.celo.org/alfajores)
- Swap CELO → cUSD on [Mento](https://app.mento.org) if needed
- Check balance with wallet

**"Treasury not funded":**
- Contract may need CELO funds
- Owner can fund with `fundTreasury()` function
- Check balance: `node check-contract-balance.mjs`

**"Transaction reverted":**
- Ensure minimum score (100 points) is reached
- Check that level hasn't been claimed already
- Verify contract addresses in `.env.local`

### ngrok Issues
**URL expires:**
- ngrok generates new URL on each restart
- Update MiniPay settings with new URL
- Use ngrok auth token for static URLs (paid plan)

**Connection refused:**
- Ensure dev server is running (`npm run dev`)
- Check port 3000 is not in use
- Try `ngrok http 3000 --log=stdout`

### Game Performance
**Slow/laggy gameplay:**
- Close other browser tabs
- Check browser console for errors
- Reduce particle effects (edit gameEngine.ts)
- Use modern browser (Chrome/Safari recommended)

**Score not saving:**
- Check localStorage is enabled
- Verify wallet is connected
- Check browser console for errors

## 📚 Resources & Documentation

### Celo & MiniPay
- [MiniPay Documentation](https://docs.celo.org/build-on-celo/build-on-minipay)
- [Celo Developer Docs](https://docs.celo.org)
- [Celo Composer](https://github.com/celo-org/celo-composer)
- [Celo Testnet Faucet](https://faucet.celo.org/alfajores)
- [Celoscan Explorer](https://sepolia.celoscan.io)

### Development Tools
- [Wagmi Documentation](https://wagmi.sh)
- [Viem Documentation](https://viem.sh)
- [RainbowKit](https://www.rainbowkit.com)
- [Hardhat](https://hardhat.org)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts)

### Blockchain Explorers
- [Celo Sepolia Testnet](https://sepolia.celoscan.io)
- [Celo Mainnet](https://celoscan.io)

### Project Documentation
- `IMPLEMENTATION_SUMMARY.md` - Technical implementation details
- `CONTRACT_DEPLOY.md` - Contract deployment guide
- `TREASURY_SYSTEM.md` - Treasury reward system
- `MINIPAY_TESTING.md` - MiniPay testing guide
- `CONTROLS.md` - Game controls documentation

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

### Priority Areas
- [ ] Implement score verification (signature-based or oracle)
- [ ] Add rate limiting to prevent spam
- [ ] Build on-chain leaderboard system
- [ ] Create achievement NFTs
- [ ] Improve mobile touch controls
- [ ] Add sound effects and music
- [ ] Multiplayer mode via websockets
- [ ] Advanced analytics dashboard

### Development Process
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards
- Use TypeScript for type safety
- Follow existing code style (ESLint config)
- Add comments for complex logic
- Test thoroughly on testnet
- Update documentation as needed

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Celo](https://celo.org) blockchain
- Powered by [MiniPay](https://www.opera.com/products/minipay)
- UI components from [RainbowKit](https://www.rainbowkit.com)
- Smart contracts using [OpenZeppelin](https://openzeppelin.com)

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/mwihoti/minipay-snake/issues)
- **Discussions**: [GitHub Discussions](https://github.com/mwihoti/minipay-snake/discussions)
- **Celo Discord**: [Join Community](https://discord.gg/celo)

---

**Built with ❤️ on Celo | Play • Earn • Repeat 🐍**
