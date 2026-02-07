import { Link } from 'react-router-dom';
import { useWalletStore } from '../store/wallet';
import WalletConnect from './WalletConnect';

export default function Header() {
  const { isConnected, publicKey } = useWalletStore();

  return (
    <header className="bg-white/10 backdrop-blur-md border-b border-white/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <span className="text-2xl">🌟</span>
            </div>
            <h1 className="text-2xl font-bold text-white">
              Stellar Crowdfunding
            </h1>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className="text-white hover:text-stellar-light transition-colors"
            >
              Campaigns
            </Link>
            {isConnected && (
              <>
                <Link
                  to="/create"
                  className="text-white hover:text-stellar-light transition-colors"
                >
                  Create Campaign
                </Link>
                <Link
                  to="/my-campaigns"
                  className="text-white hover:text-stellar-light transition-colors"
                >
                  My Campaigns
                </Link>
              </>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            {isConnected && publicKey && (
              <div className="hidden md:block text-white text-sm bg-white/10 px-4 py-2 rounded-lg">
                {publicKey.slice(0, 6)}...{publicKey.slice(-6)}
              </div>
            )}
            <WalletConnect />
          </div>
        </div>
      </div>
    </header>
  );
}
