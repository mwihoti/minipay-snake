# 📋 Park Snake - Project Files Index

## Project Root

```
minipay-snake/
```

---

## 📄 Documentation (Read First!)

| File | Purpose | Read First? |
|------|---------|-----------|
| `README.md` | Quick start, features overview | ⭐⭐⭐ |
| `BUILD_SUMMARY.md` | What was built, architecture | ⭐⭐ |
| `DEVELOPER_GUIDE.md` | Complete technical guide | ⭐⭐ |
| `DEPLOYMENT.md` | Production deployment steps | ⭐ |

---

## 🎮 Frontend Code

### App Router & Pages

| File | Lines | Purpose |
|------|-------|---------|
| `app/page.tsx` | 50 | Main game component, state management |
| `app/layout.tsx` | 30 | HTML root layout, metadata |
| `app/globals.css` | 100 | Global styles, animations, retro UI |

### Components

| File | Lines | Purpose |
|------|-------|---------|
| `components/GameCanvas.tsx` | 300 | Canvas rendering, 60fps game loop, keyboard input |
| `components/GameUI.tsx` | 200 | Score display, game over modal, controls info |

### Game Logic

| File | Lines | Purpose |
|------|-------|---------|
| `lib/gameEngine.ts` | 400 | Game state machine, collision detection, scoring |
| `lib/audioManager.ts` | 70 | Web Audio API, SFX generation |
| `lib/celoIntegration.ts` | 120 | Viem RPC calls, wallet integration, score submission |

### Types & Configuration

| File | Lines | Purpose |
|------|-------|---------|
| `types/ethereum.ts` | 20 | TypeScript definitions for window.ethereum |
| `tsconfig.json` | 20 | TypeScript compiler options |
| `.eslintrc.js` | 5 | ESLint configuration |
| `tailwind.config.ts` | 40 | Tailwind CSS theme (colors, animations) |
| `postcss.config.js` | 3 | PostCSS plugins |
| `next.config.js` | 10 | Next.js build configuration |

---

## 🔗 Blockchain Code

| File | Lines | Purpose |
|------|-------|---------|
| `contracts/SnakeGameScoreRegistry.sol` | 300 | Smart contract for on-chain leaderboard |

**Contract Functions:**
- `submitScore()`: Register game score on-chain
- `getTopScores()`: Fetch leaderboard
- `getPlayerStats()`: Player score history
- `topUpRewardPool()`: Owner can fund rewards

---

## ⚙️ Configuration & Setup

| File | Purpose |
|------|---------|
| `package.json` | NPM dependencies & scripts |
| `.env.example` | Environment variables template |
| `.gitignore` | Git ignore patterns |
| `setup.sh` | Quick setup script (bash) |

---

## 📊 Project Statistics

### Code Breakdown

```
Frontend Components:    ~550 lines
  ├── GameCanvas.tsx   ~300 lines
  └── GameUI.tsx       ~250 lines

Game Logic:           ~590 lines
  ├── gameEngine.ts    ~400 lines
  ├── celoIntegration  ~120 lines
  └── audioManager.ts  ~70 lines

Smart Contract:       ~300 lines
  └── SnakeGameScoreRegistry.sol

Styles & Config:      ~200 lines
  ├── globals.css      ~100 lines
  └── Config files     ~100 lines

Documentation:        ~1500 lines
  ├── README.md        ~300 lines
  ├── DEVELOPER_GUIDE  ~600 lines
  ├── DEPLOYMENT.md    ~300 lines
  └── BUILD_SUMMARY    ~300 lines

Total:               ~3000 lines of code
```

### Key Metrics

| Metric | Value |
|--------|-------|
| Components | 2 (GameCanvas, GameUI) |
| Game Logic Functions | 15+ |
| Smart Contract Functions | 7 |
| Assets (Canvas only) | ~5 sprite types |
| Audio Sounds | 6 types |
| Animations | 4 CSS keyframes |
| Celo Integration Points | 5 |

---

## 🚀 Quick File Reference

### To Add Features

**New Powerup:**
1. Edit `lib/gameEngine.ts` - Add type to `Powerup`
2. Edit `components/GameCanvas.tsx` - Add render logic
3. Edit `lib/gameEngine.ts` - Add collision handler

**New Obstacle:**
1. Edit `lib/gameEngine.ts` - Add to state, spawn logic
2. Edit `components/GameCanvas.tsx` - Add draw function

**New Score Tier:**
1. Edit `lib/gameEngine.ts` - Add threshold check
2. Edit `components/GameUI.tsx` - Add UI for tier
3. Edit `contracts/SnakeGameScoreRegistry.sol` - Update reward calculation

**New Audio:**
1. Edit `lib/audioManager.ts` - Add `playXxx()` method
2. Call from `lib/gameEngine.ts` when event happens

### To Deploy

1. Edit `.env.local` with production values
2. Run `npm run build`
3. Run `vercel --prod` (or netlify deploy --prod)
4. Deploy contract: `npx hardhat run scripts/deploy.ts --network celoMainnet`

---

## 📚 File Dependencies

```
app/page.tsx
├── components/GameCanvas.tsx
│   ├── lib/gameEngine.ts
│   └── lib/audioManager.ts
├── components/GameUI.tsx
│   ├── lib/celoIntegration.ts
│   └── lib/gameEngine.ts
└── lib/celoIntegration.ts

Smart Contract: SnakeGameScoreRegistry.sol
└── (Independent, deployed separately)
```

---

## 🎯 File Purpose Summary

### Must-Understand Files (20 min read)

1. **lib/gameEngine.ts** - Core game logic
2. **components/GameCanvas.tsx** - Rendering & game loop
3. **lib/celoIntegration.ts** - Blockchain integration

### Should-Understand Files (30 min read)

4. **components/GameUI.tsx** - User interface
5. **contracts/SnakeGameScoreRegistry.sol** - Smart contract
6. **app/globals.css** - Styling & animations

### Configuration Files (5 min)

7. **package.json** - Dependencies
8. **tsconfig.json** - TypeScript config
9. **.env.example** - Environment variables

---

## 🔄 Development Workflow

```
1. Edit code in:
   - lib/gameEngine.ts (game logic)
   - components/GameCanvas.tsx (rendering)
   - lib/celoIntegration.ts (blockchain)

2. Test locally:
   npm run dev
   http://localhost:3000

3. Build for production:
   npm run build

4. Deploy:
   vercel --prod

5. For smart contract updates:
   npx hardhat compile
   npx hardhat deploy --network celo
```

---

## ✅ File Checklist

Generated files:
- ✅ app/page.tsx
- ✅ app/layout.tsx
- ✅ app/globals.css
- ✅ components/GameCanvas.tsx
- ✅ components/GameUI.tsx
- ✅ lib/gameEngine.ts
- ✅ lib/celoIntegration.ts
- ✅ lib/audioManager.ts
- ✅ contracts/SnakeGameScoreRegistry.sol
- ✅ types/ethereum.ts
- ✅ tsconfig.json
- ✅ next.config.js
- ✅ tailwind.config.ts
- ✅ postcss.config.js
- ✅ .eslintrc.js
- ✅ package.json
- ✅ .env.example
- ✅ .gitignore
- ✅ setup.sh
- ✅ README.md
- ✅ DEVELOPER_GUIDE.md
- ✅ DEPLOYMENT.md
- ✅ BUILD_SUMMARY.md

**Total: 23 files**

---

**🎮 Ready to build on Celo! Start with README.md**
