# SUDOZ NFT Frontend Deployment Notes

## After Contract Deployment

Once you've deployed the contracts, update the following constants in `src/constants/contract.ts`:

1. **Main Contract IDs** (from deployment-v8 or latest):
   - `PACKAGE_ID`: The deployed package ID
   - `ADMIN_CAP_ID`: The AdminCap object ID
   - `GLOBAL_STATS_ID`: The GlobalStats object ID

2. **Evolved Module IDs** (from evolved module deployment):
   - `EVOLVED_ADMIN_CAP_ID`: The EvolvedAdminCap object ID
   - `EVOLVED_STATS_ID`: The EvolvedStats object ID

## Features Implemented

### 1. SUDOZ ARTIFACT Collection
- Display format: "SUDOZ ARTIFACT #[number]"
- Shows level, points, and path information
- Upgrade functionality (single level or multiple levels)
- Evolution to THE SUDOZ at level 10

### 2. THE SUDOZ Collection
- Display format: "THE SUDOZ #[number]"
- Shows metadata ID and heritage information
- Displays on-chain traits (background, skin, clothes, etc.)
- Golden border to distinguish evolved NFTs

### 3. Admin Dashboard
- View collection statistics
- Withdraw accumulated upgrade fees
- Mint new SUDOZ artifacts
- Developer reserve minting for THE SUDOZ collection:
  - Mint specific 1/1 NFTs (10 predetermined metadata IDs)
  - Mint random NFTs in batches (up to 50 per transaction)
  - View evolved collection statistics

### 4. Developer Reserve
The admin can mint 280 free THE SUDOZ NFTs:
- 10 specific 1/1s with metadata IDs: 504, 998, 1529, 2016, 2530, 3022, 3533, 4059, 4555, 5190
- 270 random NFTs from the remaining pool

## UI Components

- **NFTCard**: Displays SUDOZ ARTIFACT NFTs with upgrade/evolve actions
- **NFTList**: Shows all owned SUDOZ ARTIFACT NFTs
- **EvolvedNFTList**: Shows all owned THE SUDOZ NFTs
- **AdminSection**: Admin dashboard with minting and fee management
- **WalletConnect**: Wallet connection interface

## Network Configuration

The app is configured for Sui testnet by default. To switch networks, update the network configuration in `src/app/providers.tsx`.

## Running the Frontend

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Environment Variables

No environment variables are required for the frontend. All contract addresses are configured in the constants file.