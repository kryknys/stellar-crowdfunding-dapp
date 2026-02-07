import { useState } from 'react';
import { useWalletStore } from '../store/wallet';
import { stellarService } from '../services/stellar';

export default function WalletConnect() {
  const { isConnected, disconnect, setWallet } = useWalletStore();
  const [showModal, setShowModal] = useState(false);
  const [secretKey, setSecretKey] = useState('');
  const [error, setError] = useState('');

  const handleConnect = () => {
    if (!stellarService.isValidSecretKey(secretKey)) {
      setError('Invalid secret key format');
      return;
    }

    try {
      const keypair = stellarService.generateKeypair();
      setWallet(keypair.publicKey(), secretKey);
      setShowModal(false);
      setSecretKey('');
      setError('');
    } catch (err) {
      setError('Failed to connect wallet');
    }
  };

  const handleGenerateNew = async () => {
    try {
      const keypair = stellarService.generateKeypair();
      await stellarService.fundAccount(keypair.publicKey());
      setWallet(keypair.publicKey(), keypair.secret());
      alert(`New wallet created!\n\nPublic Key: ${keypair.publicKey()}\nSecret Key: ${keypair.secret()}\n\nSave your secret key securely!`);
      setShowModal(false);
    } catch (err) {
      setError('Failed to create wallet');
    }
  };

  if (isConnected) {
    return (
      <button
        onClick={disconnect}
        className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors"
      >
        Disconnect
      </button>
    );
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="bg-white text-stellar-purple px-6 py-2 rounded-lg font-semibold hover:bg-stellar-light hover:text-white transition-colors"
      >
        Connect Wallet
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-6 text-stellar-purple">
              Connect Your Wallet
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Secret Key
                </label>
                <input
                  type="password"
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                  placeholder="S..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-stellar-purple focus:border-transparent"
                />
              </div>

              {error && (
                <div className="text-red-500 text-sm">{error}</div>
              )}

              <button
                onClick={handleConnect}
                className="w-full bg-stellar-purple text-white py-3 rounded-lg font-semibold hover:bg-stellar-blue transition-colors"
              >
                Connect
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">OR</span>
                </div>
              </div>

              <button
                onClick={handleGenerateNew}
                className="w-full bg-stellar-light text-white py-3 rounded-lg font-semibold hover:bg-stellar-purple transition-colors"
              >
                Generate New Wallet (Testnet)
              </button>

              <button
                onClick={() => setShowModal(false)}
                className="w-full text-gray-600 py-2 hover:text-gray-800"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
