# Stellar Testnet Deployment Guide

This guide will walk you through deploying the Stellar Crowdfunding dApp to Stellar Testnet.

## Prerequisites

- Stellar CLI (soroban-cli) installed
- Rust toolchain installed
- Funded Stellar Testnet account

## Step-by-Step Deployment

### 1. Build the Smart Contract

```bash
cd contracts/crowdfunding

# Build the contract
soroban contract build

# This creates the WASM file at:
# target/wasm32-unknown-unknown/release/crowdfunding_contract.wasm
```

### 2. Configure Stellar Network

```bash
# Add Testnet network
soroban network add testnet \
  --rpc-url https://soroban-testnet.stellar.org:443 \
  --network-passphrase "Test SDF Network ; September 2015"

# Verify network configuration
soroban network ls
```

### 3. Create Deployer Identity

```bash
# Generate new identity
soroban keys generate deployer --network testnet

# View the public key
soroban keys address deployer

# This will output something like:
# GAYMGXUQ2A3SYYJ4BK2IRROUXCEZUQVOOGLLU4V3GXMBEBHFXTCZ7V3I
```

### 4. Fund the Deployer Account

```bash
# Fund the account using Friendbot
soroban keys fund deployer --network testnet

# Verify the account is funded
soroban keys show deployer
```

### 5. Deploy the Contract

```bash
# Deploy to Testnet
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/crowdfunding_contract.wasm \
  --source deployer \
  --network testnet

# Save the contract ID that's returned
# Example output:
# CDUMMYCONTRACTIDXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

### 6. Initialize the Contract (Optional)

If your contract requires initialization:

```bash
# Initialize the contract
soroban contract invoke \
  --id YOUR_CONTRACT_ID \
  --source deployer \
  --network testnet \
  -- initialize
```

### 7. Update Frontend Configuration

Update the contract ID in your frontend:

```bash
cd ../../frontend

# Create or update .env file
echo "VITE_CONTRACT_ID=YOUR_ACTUAL_CONTRACT_ID" > .env
```

Also update `src/services/stellar.ts`:

```typescript
export const stellarService = new StellarService(
  'YOUR_ACTUAL_CONTRACT_ID'
);
```

### 8. Test the Deployment

```bash
# Test contract invocation
soroban contract invoke \
  --id YOUR_CONTRACT_ID \
  --source deployer \
  --network testnet \
  -- get_campaign --campaign_id 1
```

## Verification

### Verify on Stellar Expert

Visit: `https://stellar.expert/explorer/testnet/contract/YOUR_CONTRACT_ID`

### Test Frontend Connection

```bash
cd frontend
npm run dev
```

Navigate to `http://localhost:3000` and test:
1. Connect wallet
2. Create a campaign
3. View campaigns
4. Make a donation

## Troubleshooting

### Issue: Contract deployment fails

**Solution**: Ensure your deployer account is funded
```bash
soroban keys fund deployer --network testnet
```

### Issue: Contract invocation fails

**Solution**: Check contract is properly initialized
```bash
soroban contract invoke \
  --id YOUR_CONTRACT_ID \
  --source deployer \
  --network testnet \
  -- initialize
```

### Issue: Frontend can't connect to contract

**Solution**: Verify contract ID is correct in both `.env` and `stellar.ts`

## Production Considerations

For mainnet deployment:

1. Use mainnet network configuration
2. Secure key management (hardware wallets, key management systems)
3. Thorough testing on testnet
4. Security audit of smart contracts
5. Gas optimization
6. Rate limiting
7. Monitoring and alerting

## Contract Upgrade Path

To upgrade the contract:

```bash
# Build new version
cargo build --release --target wasm32-unknown-unknown

# Deploy new contract
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/crowdfunding_contract.wasm \
  --source deployer \
  --network testnet

# Update frontend with new contract ID
```

## Additional Resources

- [Stellar Developers](https://developers.stellar.org)
- [Soroban Documentation](https://soroban.stellar.org/docs)
- [Stellar Laboratory](https://laboratory.stellar.org)
- [Stellar Expert](https://stellar.expert)

## Support

For deployment issues:
- Check Stellar Discord: https://discord.gg/stellardev
- Review Soroban docs: https://soroban.stellar.org
- Open an issue on GitHub
