import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useWalletStore } from '../store/wallet';
import { stellarService } from '../services/stellar';
import CampaignCard from '../components/CampaignCard';

export default function Home() {
  const { campaigns, setCampaigns, isConnected } = useWalletStore();

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    try {
      const data = await stellarService.getCampaigns();
      setCampaigns(data);
    } catch (error) {
      console.error('Error loading campaigns:', error);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center text-white">
        <h1 className="text-5xl font-bold mb-4">
          Fund the Future on Stellar
        </h1>
        <p className="text-xl opacity-90 mb-8">
          Create and support campaigns on the Stellar blockchain
        </p>
        {isConnected && (
          <Link
            to="/create"
            className="inline-block bg-white text-stellar-purple px-8 py-3 rounded-lg font-semibold hover:bg-stellar-light hover:text-white transition-colors"
          >
            Create Campaign
          </Link>
        )}
      </div>

      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <h2 className="text-2xl font-bold text-white mb-6">
          Active Campaigns
        </h2>

        {campaigns.length === 0 ? (
          <div className="text-center text-white/70 py-12">
            <p className="text-lg">No campaigns yet. Be the first to create one!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
