import { Link } from 'react-router-dom';
import { Campaign } from '../store/wallet';

interface CampaignCardProps {
  campaign: Campaign;
}

export default function CampaignCard({ campaign }: CampaignCardProps) {
  const progress = (parseFloat(campaign.raised) / parseFloat(campaign.goal)) * 100;
  const daysLeft = Math.ceil((campaign.deadline - Date.now()) / (1000 * 60 * 60 * 24));

  return (
    <Link
      to={`/campaign/${campaign.id}`}
      className="block bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
    >
      <div className="h-48 bg-gradient-to-br from-stellar-purple to-stellar-blue"></div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          {campaign.title}
        </h3>
        
        <p className="text-gray-600 mb-4 line-clamp-2">
          {campaign.description}
        </p>

        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>{campaign.raised} XLM raised</span>
              <span>{campaign.goal} XLM goal</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-stellar-purple h-2 rounded-full transition-all"
                style={{ width: `${Math.min(progress, 100)}%` }}
              ></div>
            </div>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-600">
              {Math.round(progress)}% funded
            </span>
            <span className={`font-semibold ${
              daysLeft > 7 ? 'text-green-600' : 'text-red-600'
            }`}>
              {daysLeft > 0 ? `${daysLeft} days left` : 'Ended'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
