# Park Snake - Play to Earn Guide 🎮💰

## Overview

Park Snake is now a full **Play-to-Earn (P2E)** game on Celo with blockchain-based rewards! Connect your wallet, choose your land, and start earning **cUSD** tokens for every game you play.

## Network: Celo Sepolia Testnet

All transactions run on **Celo Sepolia Testnet** - perfect for testing without real money.

**Network Details:**
- **Chain ID:** 44787
- **RPC:** https://alfajores-forno.celo-testnet.org
- **cUSD Token:** 0x86a37b6Ca4f0123b643f785385Eb0860D5EE810d
- **Explorer:** https://sepolia-blockscout.celo-testnet.org

## Getting Started

### 1. Set Up Wallet

**Option A: RainbowKit (Built-in)**
- Click the wallet icon in the top-right
- Select your wallet provider (MetaMask, WalletConnect, Coinbase, etc.)
- Connect and approve the connection

**Option B: Get Testnet cUSD**
Get free testnet cUSD to buy premium lands:
1. Visit [Celo Faucet](https://faucet.celo-testnet.org)
2. Enter your wallet address
3. Receive free testnet cUSD
4. Use it to purchase the Enchanted Forest land!

### 2. Choose Your Land 🏞️

Click the **"🏞️ Lands"** button to see available lands:

#### Free Lands (Everyone)
- **Sunny Park** 🌳
  - Price: Free
  - Description: A beautiful sunny park with green grass
  - Reward Multiplier: 1.0x

#### Premium Lands (Buy with cUSD)
- **Enchanted Forest** 🌲
  - Price: 10 cUSD (on Sepolia testnet)
  - Description: A magical forest with tall trees
  - Reward Multiplier: 1.5x (50% more rewards!)

When you purchase a land, it's yours to use forever. Switch between your owned lands anytime!

### 3. Play and Earn

1. Click "Activate" to select your active land
2. Play the game as normal
3. When you get Game Over, you'll see your **Play-to-Earn rewards section**:
   ```
   Base Reward: (score ÷ 100) cUSD
   Land Multiplier: Applied based on your active land
   Sunset Bonus: +50% if you unlocked Sunset Mode
   Total Reward: Your final earnings in cUSD
   ```

4. Click **"🚀 CLAIM REWARD ON CELO"** to submit your score to the blockchain
5. Wait for confirmation - your cUSD rewards are transferred directly to your wallet!

## Reward Calculation

```
Base Reward = Score ÷ 100
Multiplied by Land Multiplier (1.0x - 1.5x depending on your land)
Plus Sunset Mode Bonus (if unlocked): +50%
Capped at: Maximum 100 cUSD per game
```

### Example Rewards

| Score | Base | Land | Sunset | Total |
|-------|------|------|--------|-------|
| 1000 | 10 cUSD | Park (1.0x) | No | **10 cUSD** |
| 1000 | 10 cUSD | Forest (1.5x) | No | **15 cUSD** |
| 2000 | 20 cUSD | Forest (1.5x) | Yes | **45 cUSD** |
| 5000 | 50 cUSD | Forest (1.5x) | Yes | **100 cUSD** |

## Smart Contract Features

### SnakeGameRewards Contract

**Address:** (Deploy to Sepolia - will be provided)

**Key Functions:**

#### User Functions
```solidity
// Submit a completed game score and claim rewards
submitScore(uint256 score, bool sunsetMode)

// Purchase a premium land
purchaseLand(uint256 landId)

// Activate a land for gameplay
activateLand(uint256 landId)

// View your stats
getPlayerStats(address player) → PlayerData
```

#### View Functions
```solidity
// Get all available lands
getAllLands() → Land[]

// Get top scores
getLeaderboard(uint256 limit) → ScoreRecord[]

// Check if you own a land
ownsLand(address player, uint256 landId) → bool
```

**Events:**
- `ScoreSubmitted` - When a score is claimed
- `LandPurchased` - When a land is bought
- `LandActivated` - When a land is activated
- `RewardWithdrawn` - When rewards are withdrawn

## Configuration

### Environment Variables (.env.local)

Create a `.env.local` file with:

```env
# Network Configuration
NEXT_PUBLIC_NETWORK=testnet
NEXT_PUBLIC_CHAIN_ID=44787
NEXT_PUBLIC_RPC_URL=https://alfajores-forno.celo-testnet.org

# Smart Contract Address
NEXT_PUBLIC_REWARDS_CONTRACT=0xYourContractAddress

# cUSD Token Address (do not change)
NEXT_PUBLIC_cUSD_ADDRESS=0x86a37b6Ca4f0123b643f785385Eb0860D5EE810d

# WalletConnect Project ID (optional, for WalletConnect support)
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id
```

## Deploying Your Own Contract

### Step 1: Deploy to Celo Sepolia

Using Hardhat or Truffle:

```bash
# Deploy the SnakeGameRewards contract
npx hardhat run scripts/deploy.js --network celoSepolia
```

### Step 2: Update Contract Address

1. Get your deployed contract address from the transaction receipt
2. Add it to `.env.local`:
   ```env
   NEXT_PUBLIC_REWARDS_CONTRACT=0xYourDeployedAddress
   ```

### Step 3: Fund the Contract

The contract needs cUSD to pay out rewards:

```bash
# Transfer some testnet cUSD to the contract
# (Use MetaMask or a script to do this)
```

### Step 4: Create Custom Lands (Optional)

As contract owner, you can create new lands:

```javascript
// Via Etherscan verify + contract interaction
contract.createLand(
  landType,     // 0 = PARK, 1 = FOREST
  name,         // "My Land"
  description,  // "Description"
  price,        // in wei (e.g., 10 ether for 10 cUSD)
  multiplier    // 100-300 (100 = 1.0x, 150 = 1.5x)
)
```

## Architecture

### Tech Stack

- **Blockchain:** Celo Sepolia Testnet
- **Smart Contracts:** Solidity + OpenZeppelin
- **Frontend:** Next.js 14 + React 18 + TypeScript
- **Wallet Connection:** RainbowKit + Wagmi v2
- **Styling:** Tailwind CSS
- **Token:** cUSD (ERC20)

### Components

```
Web3Provider (wagmi + RainbowKit)
├── WalletConnect (Rainbow connection UI)
├── LandsManager (Buy/switch lands)
├── RewardsSubmitter (Claim rewards)
└── GameUI (Main game interface)
    └── GameCanvas (Game logic)
```

## Security Notes

⚠️ **Important for Production:**

1. **Never hardcode private keys** in the `.env` file
2. **Use a multi-sig wallet** for contract ownership
3. **Audit the smart contract** before deploying with real funds
4. **Implement cooldown periods** to prevent spam submissions
5. **Add score verification** (optional antifraud measures)
6. **Use Celo's native stablecoins** (cUSD or cEUR)

## Testnet Faucets & Resources

**Get Free Testnet cUSD:**
- [Celo Faucet](https://faucet.celo-testnet.org)
- [Celo Discord Faucet](https://discord.gg/celo) (#faucet-request channel)

**Explore Transactions:**
- [Celo Sepolia Explorer](https://sepolia-blockscout.celo-testnet.org)

**Documentation:**
- [Celo Docs](https://docs.celo.org)
- [Wagmi Docs](https://wagmi.sh)
- [RainbowKit Docs](https://rainbowkit.com)

## Troubleshooting

### "Network not recognized"
- Ensure you're on Celo Sepolia (Chain ID: 44787)
- Check your wallet settings

### "Contract not found"
- Verify the contract address in `.env.local`
- Make sure contract is deployed to Sepolia

### "Insufficient balance to claim rewards"
- Contract needs cUSD to pay out
- Owner must fund the contract

### "Land not owned"
- You haven't purchased this land yet
- Free lands can be activated immediately
- Premium lands require purchase first

## Roadmap

- [ ] Mainnet deployment (with real cUSD rewards)
- [ ] More land types (Desert, Mountains, Space)
- [ ] Season system with time-limited lands
- [ ] Referral rewards
- [ ] Leaderboard NFT badges
- [ ] Governance tokens for land voting
- [ ] Cross-chain rewards (via Hyperlane)

## Support

Have questions? Join the community:
- 🐦 Twitter: [@celoOrg](https://twitter.com/celoOrg)
- 💬 Discord: [Celo Discord](https://discord.gg/celo)
- 📚 Docs: [docs.celo.org](https://docs.celo.org)

---

**Happy earning! 🚀💚**
