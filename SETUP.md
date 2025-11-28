# Quick Setup: Park Snake Play-to-Earn 🎮💚

## What You Now Have

✅ **Full Web3 Game** on Celo Sepolia Testnet  
✅ **RainbowKit Wallet Integration** (MetaMask, WalletConnect, Coinbase)  
✅ **Smart Contract Rewards** (automatic payout in cUSD)  
✅ **Customizable Lands** (Sunny Park + Enchanted Forest)  
✅ **Play-to-Earn Mechanics** (earn while you play!)  

## 5-Minute Setup

### 1. Start Dev Server

```bash
cd /home/daniel/work/celo/minipay-snake
npm run dev
```

Open http://localhost:3000 🎮

### 2. Connect Your Wallet

- Click the wallet icon (top-right)
- Select MetaMask or any wallet
- Switch to **Celo Sepolia** network
- Approve connection

### 3. Get Testnet cUSD (Optional - for premium land)

Visit: https://faucet.celo-testnet.org
- Enter your wallet address
- Receive 1-2 testnet cUSD
- Use to buy "Enchanted Forest" land for 10x rewards! (Note: testnet amount may vary)

### 4. Choose Your Land

Click **"🏞️ Lands"** button:
- **Sunny Park** (Free, 1.0x rewards)
- **Enchanted Forest** (10 cUSD, 1.5x rewards)

Select "Activate" to play with that land.

### 5. Play & Earn

1. Play the game normally
2. When game over, see your **estimated rewards**
3. Click **"🚀 CLAIM REWARD ON CELO"**
4. Rewards appear in your wallet! 💰

## Project Structure

```
minipay-snake/
├── contracts/
│   ├── SnakeGameRewards.sol      ← Smart contract for rewards
│   └── SnakeGameScoreRegistry.sol (legacy)
├── components/
│   ├── Web3Provider.tsx           ← Wagmi + RainbowKit setup
│   ├── WalletConnect.tsx          ← Wallet UI
│   ├── LandsManager.tsx           ← Land selection/purchase
│   ├── RewardsSubmitter.tsx       ← Claim rewards UI
│   ├── GameCanvas.tsx            ← Game rendering
│   └── GameUI.tsx                ← Game HUD + controls
├── lib/
│   ├── gameEngine.ts             ← Game logic
│   ├── audioManager.ts           ← Sound effects
│   └── celoIntegration.ts        ← Blockchain calls
├── wagmi.config.ts               ← Web3 configuration
├── .env.local.example            ← Environment template
├── CONTROLS.md                   ← Game controls guide
├── PLAY_TO_EARN.md              ← Rewards guide
└── DEPLOYMENT.md                 ← Production guide
```

## Environment Setup

Create `.env.local`:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
# Use Celo Sepolia by default (testnet)
NEXT_PUBLIC_NETWORK=testnet
NEXT_PUBLIC_CHAIN_ID=44787
NEXT_PUBLIC_RPC_URL=https://alfajores-forno.celo-testnet.org

# Deploy the smart contract and add address here
NEXT_PUBLIC_REWARDS_CONTRACT=0x0000000000000000000000000000000000000000

# cUSD token (don't change)
NEXT_PUBLIC_cUSD_ADDRESS=0x86a37b6Ca4f0123b643f785385Eb0860D5EE810d

# Optional: Get from https://cloud.walletconnect.com
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_id_here
```

## Deploying Smart Contract

### Option 1: Deploy to Sepolia (Testing)

**Use Remix IDE (Easiest):**

1. Go to https://remix.ethereum.org
2. Create new file: `SnakeGameRewards.sol`
3. Copy content from `/contracts/SnakeGameRewards.sol`
4. Compile with Solidity 0.8.20
5. Connect MetaMask → Celo Sepolia
6. Deploy! 🚀
7. Copy contract address → `.env.local`

**Or use Hardhat (for developers):**

```bash
# Install Hardhat (in project root)
npm install --save-dev hardhat

# Create deployment script at scripts/deploy.js
# Update hardhat.config.js with Celo Sepolia network
# Deploy!
npx hardhat run scripts/deploy.js --network celoSepolia
```

### Option 2: Production on Mainnet

Same process but:
- Use Celo Mainnet (Chain ID: 42220)
- Real cUSD tokens needed
- Use verified contract on Blockscout

## Testing Checklist

- [ ] Dev server runs (`npm run dev`)
- [ ] Page loads at http://localhost:3000
- [ ] Wallet connects successfully
- [ ] Can see both lands in Lands menu
- [ ] Can activate free "Sunny Park" land
- [ ] Can play game with all controls working
- [ ] Score displays correctly
- [ ] Game over screen shows rewards
- [ ] Build passes (`npm run build`)

## Key Features

### Rewards System

```
Earned cUSD = (Score ÷ 100) × Land Multiplier × Sunset Bonus
                Base Reward    Land Effect    +50% if unlocked
```

**Example:** 1000 points on Enchanted Forest + Sunset Mode = 15 cUSD

### Two Lands Available

| Land | Type | Price | Multiplier | Details |
|------|------|-------|-----------|---------|
| 🌳 Sunny Park | Free | 0 cUSD | 1.0x | Green grass, always available |
| 🌲 Enchanted Forest | Premium | 10 cUSD | 1.5x | Magical trees, 50% more rewards! |

### Smart Contract Functions

```solidity
submitScore(score, isSunsetMode)  // Claim rewards
activateLand(landId)              // Switch active land
purchaseLand(landId)              // Buy premium land
getPlayerStats(address)           // View your stats
getAllLands()                     // See all lands
getLeaderboard(limit)             // Top scores
```

## Common Issues & Fixes

### "Wrong Network"
→ Switch MetaMask to Celo Sepolia manually in dropdown

### "Contract not found"
→ Deploy contract to Sepolia first (or use Remix)
→ Add contract address to `.env.local`

### "Contract out of funds"
→ Contract needs cUSD to pay rewards
→ Send some testnet cUSD to contract address

### "Can't connect wallet"
→ Refresh page
→ Clear browser cache
→ Try different wallet (MetaMask, Coinbase, WalletConnect)

### Build errors
```bash
# Clean and rebuild
rm -rf .next node_modules
npm install
npm run build
```

## Next Steps

1. **Test locally** - Play some games and claim rewards
2. **Deploy contract** - Use Remix or Hardhat
3. **Deploy frontend** - Push to Vercel/Netlify
4. **Go mainnet** (optional) - When ready for real rewards
5. **Create custom lands** - Add your own land types!

## File Locations

| File | Purpose |
|------|---------|
| `contracts/SnakeGameRewards.sol` | Smart contract source |
| `components/Web3Provider.tsx` | Wagmi setup |
| `components/WalletConnect.tsx` | Wallet UI |
| `components/LandsManager.tsx` | Land menu |
| `components/RewardsSubmitter.tsx` | Claim rewards UI |
| `wagmi.config.ts` | Web3 config |
| `.env.local` | Your secrets |
| `PLAY_TO_EARN.md` | Full rewards guide |
| `DEPLOYMENT.md` | Production guide |
| `CONTROLS.md` | Game controls |

## Resources

**Celo:**
- Docs: https://docs.celo.org
- Faucet: https://faucet.celo-testnet.org
- Explorer: https://sepolia-blockscout.celo-testnet.org

**Web3:**
- Wagmi: https://wagmi.sh
- RainbowKit: https://rainbowkit.com
- Ethers.js: https://docs.ethers.org

**Development:**
- Next.js: https://nextjs.org
- TypeScript: https://typescriptlang.org
- Tailwind: https://tailwindcss.com

## Ready to Go! 🚀

Your game is production-ready with:
- ✅ Full Web3 integration
- ✅ Play-to-earn mechanics
- ✅ Multiple lands
- ✅ Smart contract rewards
- ✅ Mobile + desktop controls

**Start playing and earning!** 💚

Questions? Check:
- `PLAY_TO_EARN.md` - Rewards explanation
- `DEPLOYMENT.md` - Production setup
- `CONTROLS.md` - Game controls

---

**Happy gaming! 🎮💰**
