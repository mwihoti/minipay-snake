# Treasury Level Milestone System

## Overview

Players earn **0.3 CELO** for each **level milestone** (10 levels total).

- **Level 1**: 1000 points → 0.3 CELO
- **Level 2**: 2000 points → 0.3 CELO
- **Level 3**: 3000 points → 0.3 CELO
- ... up to Level 10

## Deployment Steps

### 1. Compile Both Contracts

```bash
npm pkg set type="module"
npx hardhat compile
npm pkg delete type
```

### 2. Deploy CeloTreasury Contract

```bash
node scripts/deploy-treasury.mjs
```

Output:
```
✅ CeloTreasury deployed to: 0x...
```

### 3. Update .env.local

Add the treasury address to `.env.local`:

```dotenv
NEXT_PUBLIC_TREASURY_CONTRACT=0x...  # From deploy output
NEXT_PUBLIC_TREASURY_ACCOUNT=0x1567F1627220b92eA73BF69962682C8b24ca5F1B
```

### 4. Fund the Treasury

```bash
node scripts/fund-treasury.mjs
```

This sends 10 CELO to the treasury (enough for ~33 level-ups).

### 5. Restart Dev Server

```bash
npm run dev
```

## How It Works

### Game Flow

1. **Player reaches a level** (score: 1000 = Level 1, 2000 = Level 2, etc.)
2. **Game ends**
3. **Level Milestone card appears** with:
   - Current level progress bar
   - 10 target boxes (1-10)
   - "CLAIM LEVEL X" button
4. **Player clicks "CLAIM"**
5. **Contract submits score** and sends **0.3 CELO** to player
6. **Level marked as claimed** ✓

### Smart Contract

`CeloTreasury.sol` features:

- **submitScoreWithLevels()**: Submit score, get rewards
- **Level tracking**: Knows which levels each player has claimed
- **CELO payouts**: Direct transfers to player wallet
- **Treasury management**: Owner can fund/withdraw

### Frontend

`LevelMilestone.tsx` component:

- Shows progress bar to next level
- Displays 10 level targets with checkmarks
- "Claim" button when new level reached
- Shows CELO earned

## Testing

### In Browser (localhost:3002)

1. Play game until score reaches 1000 (Level 1)
2. Game ends
3. Click "💰 CLAIM LEVEL 1 (0.3 CELO)"
4. Approve transaction in MetaMask
5. ✅ Receive 0.3 CELO!

### In MiniPay

1. Start ngrok: `ngrok http 3002`
2. Load ngrok URL in MiniPay Developer Settings
3. Play game
4. Claim rewards (auto-approves in MiniPay)

## Configuration

Edit `CeloTreasury` constructor parameters:

- **Reward per level**: 0.3 CELO (edit contract)
- **Level threshold**: 1000 points per level (edit contract)
- **Treasury address**: 0x1567F... (your receiving account)

## Troubleshooting

**"Insufficient balance"**
- Fund treasury: `node scripts/fund-treasury.mjs`

**"Treasury not configured"**
- Check `.env.local` has `NEXT_PUBLIC_TREASURY_CONTRACT`

**Transaction fails**
- Make sure treasury has CELO balance
- Player wallet needs gas fees (~0.001 CELO)

## Architecture

```
Player Game → submitScoreWithLevels() → CeloTreasury
    ↓
 Checks Level
    ↓
 New Level? → Calculate Reward
    ↓
 Send 0.3 CELO → Player Wallet
    ↓
 Mark as Claimed
```

## Live Rewards

Treasury Account: `0x1567F1627220b92eA73BF69962682C8b24ca5F1B`

This account:
- Receives fees from game submissions
- Sends CELO to players
- Can withdraw excess funds

## Next Steps

1. Deploy treasury contract
2. Fund with CELO
3. Test in browser
4. Test in MiniPay
5. Monitor treasury balance
