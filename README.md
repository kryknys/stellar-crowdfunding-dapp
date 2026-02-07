# 🌟 Stellar Crowdfunding Platform

A decentralized crowdfunding platform built on Stellar blockchain with Soroban smart contracts.

## ✨ Features

- 🚀 Create fundraising campaigns on Stellar blockchain
- 💰 Donate using Stellar Lumens (XLM)
- 📊 Track campaign progress in real-time
- 🔐 Secure wallet integration
- ⚡ Fast transactions with low fees

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Soroban Smart Contracts (Rust)
- **Blockchain**: Stellar Testnet

## 🚀 Quick Start

### Prerequisites

- Node.js v18+
- Rust & Cargo
- Stellar CLI (soroban-cli)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/stellar-crowdfunding-dapp.git
cd stellar-crowdfunding-dapp

# Install frontend dependencies
cd frontend
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000`

## 📦 Deploy Smart Contract

```bash
# Build contract
cd contracts/crowdfunding
soroban contract build

# Deploy to testnet
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/crowdfunding_contract.wasm \
  --source deployer \
  --network testnet
```

Update the contract ID in `frontend/src/services/stellar.ts`

## 💡 Usage

1. **Connect Wallet** - Generate a new testnet wallet or connect existing one
2. **Create Campaign** - Set title, goal, and duration
3. **Donate** - Support campaigns with XLM
4. **Track Progress** - Monitor fundraising in real-time

## 🌐 Stellar Testnet Resources

- [Horizon API](https://horizon-testnet.stellar.org)
- [Friendbot Faucet](https://friendbot.stellar.org)
- [Stellar Laboratory](https://laboratory.stellar.org)

## 📄 License

MIT License - see [LICENSE](LICENSE) file

## 🤝 Contributing

Contributions welcome! Open an issue or submit a PR.

---

Built with ❤️ on Stellar Blockchain
