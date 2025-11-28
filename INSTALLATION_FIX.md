# Installation & Dependency Issues - RESOLVED

## Problem
When installing with `npm install` or `bun install`, the `@celo/abis` package version couldn't be resolved:

```
error: No version matching "^5.1.0" found for specifier "@celo/abis"
npm error notarget No matching version found for @celo/abis@^3.0.0
```

## Solution
Updated `package.json` to use the latest stable version of `@celo/abis`:

```json
"@celo/abis": "^14.0.1"
```

## Dependencies Used

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "next": "^14.0.0",
    "@celo/abis": "^14.0.1",
    "viem": "^2.0.0",
    "typescript": "^5.3.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0"
  }
}
```

## Verification

✅ `npm install` completes successfully
✅ `npm run dev` starts the dev server
✅ Dev server ready at `http://localhost:3000`
✅ TypeScript configured automatically

## Status

**Installation fixed! ✅ Ready to run:**

```bash
cd /home/daniel/work/celo/minipay-snake
npm run dev
# Open http://localhost:3000
```
