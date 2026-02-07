import { useWalletStore } from '../store/wallet';
import CampaignCard from '../components/CampaignCard';

export default function MyCampaigns() {
  const { campaigns, publicKey, isConnected } = useWalletStore();

  if (!isConnected) {
    return (
      <div className="text-center text-white py-12">
        <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
        <p className="text-white/80">
          Please connect your wallet to view your campaigns
        </p>
      </div>
    );
  }

  const myCampaigns = campaigns.filter(
    (campaign) => campaign.creator === publicKey
  );

  return (
    <div className="space-y-8">
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <h2 className="text-2xl font-bold text-white mb-6">
          My Campaigns
        </h2>

        {myCampaigns.length === 0 ? (
          <div className="text-center text-white/70 py-12">
            <p className="text-lg mb-4">You haven't created any campaigns yet</p>
            <a
              href="/create"
              className="inline-block bg-white text-stellar-purple px-6 py-3 rounded-lg font-semibold hover:bg-stellar-light hover:text-white transition-colors"
            >
              Create Your First Campaign
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myCampaigns.map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
