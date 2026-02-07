import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useWalletStore } from '../store/wallet';
import { stellarService } from '../services/stellar';
import { Campaign } from '../store/wallet';

export default function CampaignDetail() {
  const { id } = useParams<{ id: string }>();
  const { campaigns, isConnected, secretKey } = useWalletStore();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [donationAmount, setDonationAmount] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const found = campaigns.find((c) => c.id === parseInt(id || '0'));
    if (found) {
      setCampaign(found);
    }
  }, [id, campaigns]);

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isConnected || !secretKey || !campaign) {
      alert('Please connect your wallet first');
      return;
    }

    if (parseFloat(donationAmount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    setLoading(true);

    try {
      await stellarService.donate(secretKey, campaign.id, donationAmount);
      alert('Donation successful!');
      setDonationAmount('');
    } catch (error) {
      console.error('Error donating:', error);
      alert('Failed to donate. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!campaign) {
    return (
      <div className="text-center text-white py-12">
        <p className="text-xl">Campaign not found</p>
      </div>
    );
  }

  const progress = (parseFloat(campaign.raised) / parseFloat(campaign.goal)) * 100;
  const daysLeft = Math.ceil((campaign.deadline - Date.now()) / (1000 * 60 * 60 * 24));

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white/10 backdrop-blur-md rounded-xl overflow-hidden border border-white/20">
        <div className="h-64 bg-gradient-to-br from-stellar-purple to-stellar-blue"></div>

        <div className="p-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            {campaign.title}
          </h1>

          <div className="flex items-center text-white/80 mb-6">
            <span className="mr-4">
              By {campaign.creator.slice(0, 6)}...{campaign.creator.slice(-6)}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm ${
              campaign.active ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
            }`}>
              {campaign.active ? 'Active' : 'Ended'}
            </span>
          </div>

          <p className="text-white/90 text-lg mb-8">
            {campaign.description}
          </p>

          <div className="bg-white/5 rounded-lg p-6 mb-8">
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-white/60 text-sm">Raised</p>
                <p className="text-white text-2xl font-bold">
                  {campaign.raised} XLM
                </p>
              </div>
              <div>
                <p className="text-white/60 text-sm">Goal</p>
                <p className="text-white text-2xl font-bold">
                  {campaign.goal} XLM
                </p>
              </div>
              <div>
                <p className="text-white/60 text-sm">Time Left</p>
                <p className={`text-2xl font-bold ${
                  daysLeft > 7 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {daysLeft > 0 ? `${daysLeft} days` : 'Ended'}
                </p>
              </div>
            </div>

            <div className="w-full bg-white/20 rounded-full h-3">
              <div
                className="bg-white h-3 rounded-full transition-all"
                style={{ width: `${Math.min(progress, 100)}%` }}
              ></div>
            </div>
            <p className="text-white/80 text-sm mt-2">
              {Math.round(progress)}% funded
            </p>
          </div>

          {isConnected && campaign.active && (
            <div className="bg-white/5 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4">
                Support this campaign
              </h3>
              <form onSubmit={handleDonate} className="space-y-4">
                <div>
                  <label className="block text-white font-medium mb-2">
                    Donation Amount (XLM)
                  </label>
                  <input
                    type="number"
                    value={donationAmount}
                    onChange={(e) => setDonationAmount(e.target.value)}
                    required
                    min="0.01"
                    step="0.01"
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-white focus:border-transparent"
                    placeholder="10.00"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-white text-stellar-purple py-3 rounded-lg font-semibold hover:bg-stellar-light hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Processing...' : 'Donate Now'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
