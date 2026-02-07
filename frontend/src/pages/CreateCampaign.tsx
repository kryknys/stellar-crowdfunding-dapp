import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWalletStore } from '../store/wallet';
import { stellarService } from '../services/stellar';

export default function CreateCampaign() {
  const navigate = useNavigate();
  const { publicKey, secretKey, isConnected, addCampaign } = useWalletStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    goal: '',
    durationDays: '30',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected || !secretKey) {
      alert('Please connect your wallet first');
      return;
    }

    setLoading(true);

    try {
      await stellarService.createCampaign(
        secretKey,
        formData.title,
        formData.description,
        formData.goal,
        parseInt(formData.durationDays)
      );

      const newCampaign = {
        id: Date.now(),
        creator: publicKey!,
        title: formData.title,
        description: formData.description,
        goal: formData.goal,
        raised: '0',
        deadline: Date.now() + parseInt(formData.durationDays) * 86400000,
        active: true,
      };

      addCampaign(newCampaign);
      alert('Campaign created successfully!');
      navigate('/');
    } catch (error) {
      console.error('Error creating campaign:', error);
      alert('Failed to create campaign. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Connect Your Wallet
          </h2>
          <p className="text-white/80">
            Please connect your wallet to create a campaign
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
        <h2 className="text-3xl font-bold text-white mb-6">
          Create New Campaign
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-white font-medium mb-2">
              Campaign Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
              className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-white focus:border-transparent"
              placeholder="Enter campaign title"
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
              rows={4}
              className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-white focus:border-transparent"
              placeholder="Describe your campaign"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white font-medium mb-2">
                Goal (XLM)
              </label>
              <input
                type="number"
                value={formData.goal}
                onChange={(e) =>
                  setFormData({ ...formData, goal: e.target.value })
                }
                required
                min="1"
                step="0.01"
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-white focus:border-transparent"
                placeholder="1000"
              />
            </div>

            <div>
              <label className="block text-white font-medium mb-2">
                Duration (days)
              </label>
              <input
                type="number"
                value={formData.durationDays}
                onChange={(e) =>
                  setFormData({ ...formData, durationDays: e.target.value })
                }
                required
                min="1"
                max="365"
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-white focus:border-transparent"
                placeholder="30"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-stellar-purple py-3 rounded-lg font-semibold hover:bg-stellar-light hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating...' : 'Create Campaign'}
          </button>
        </form>
      </div>
    </div>
  );
}
