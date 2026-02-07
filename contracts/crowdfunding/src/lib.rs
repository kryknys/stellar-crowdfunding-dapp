#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, String, Vec, token};

#[derive(Clone)]
#[contracttype]
pub struct Campaign {
    pub id: u64,
    pub creator: Address,
    pub title: String,
    pub description: String,
    pub goal: i128,
    pub raised: i128,
    pub deadline: u64,
    pub active: bool,
}

#[derive(Clone)]
#[contracttype]
pub struct Donation {
    pub campaign_id: u64,
    pub donor: Address,
    pub amount: i128,
    pub timestamp: u64,
}

#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    CampaignCounter,
    Campaign(u64),
    Donations(u64),
    CampaignList,
}

#[contract]
pub struct CrowdfundingContract;

#[contractimpl]
impl CrowdfundingContract {
    
    /// Initialize the contract
    pub fn initialize(env: Env) {
        env.storage().instance().set(&DataKey::CampaignCounter, &0u64);
        env.storage().instance().set(&DataKey::CampaignList, &Vec::<u64>::new(&env));
    }

    /// Create a new campaign
    pub fn create_campaign(
        env: Env,
        creator: Address,
        title: String,
        description: String,
        goal: i128,
        duration_days: u64,
    ) -> u64 {
        creator.require_auth();

        let mut counter: u64 = env.storage().instance()
            .get(&DataKey::CampaignCounter)
            .unwrap_or(0);
        
        counter += 1;

        let deadline = env.ledger().timestamp() + (duration_days * 86400);

        let campaign = Campaign {
            id: counter,
            creator: creator.clone(),
            title,
            description,
            goal,
            raised: 0,
            deadline,
            active: true,
        };

        env.storage().instance().set(&DataKey::Campaign(counter), &campaign);
        env.storage().instance().set(&DataKey::CampaignCounter, &counter);
        
        let mut campaign_list: Vec<u64> = env.storage().instance()
            .get(&DataKey::CampaignList)
            .unwrap_or(Vec::new(&env));
        campaign_list.push_back(counter);
        env.storage().instance().set(&DataKey::CampaignList, &campaign_list);

        let donations: Vec<Donation> = Vec::new(&env);
        env.storage().instance().set(&DataKey::Donations(counter), &donations);

        counter
    }

    /// Donate to a campaign
    pub fn donate(
        env: Env,
        campaign_id: u64,
        donor: Address,
        amount: i128,
    ) {
        donor.require_auth();

        let mut campaign: Campaign = env.storage().instance()
            .get(&DataKey::Campaign(campaign_id))
            .expect("Campaign not found");

        assert!(campaign.active, "Campaign is not active");
        assert!(env.ledger().timestamp() < campaign.deadline, "Campaign has ended");
        assert!(amount > 0, "Amount must be positive");

        campaign.raised += amount;

        if campaign.raised >= campaign.goal {
            campaign.active = false;
        }

        env.storage().instance().set(&DataKey::Campaign(campaign_id), &campaign);

        let donation = Donation {
            campaign_id,
            donor: donor.clone(),
            amount,
            timestamp: env.ledger().timestamp(),
        };

        let mut donations: Vec<Donation> = env.storage().instance()
            .get(&DataKey::Donations(campaign_id))
            .unwrap_or(Vec::new(&env));
        donations.push_back(donation);
        env.storage().instance().set(&DataKey::Donations(campaign_id), &donations);
    }

    /// Get campaign details
    pub fn get_campaign(env: Env, campaign_id: u64) -> Campaign {
        env.storage().instance()
            .get(&DataKey::Campaign(campaign_id))
            .expect("Campaign not found")
    }

    /// Get all campaigns
    pub fn get_all_campaigns(env: Env) -> Vec<Campaign> {
        let campaign_list: Vec<u64> = env.storage().instance()
            .get(&DataKey::CampaignList)
            .unwrap_or(Vec::new(&env));

        let mut campaigns = Vec::new(&env);
        for i in 0..campaign_list.len() {
            if let Some(id) = campaign_list.get(i) {
                if let Some(campaign) = env.storage().instance().get(&DataKey::Campaign(id)) {
                    campaigns.push_back(campaign);
                }
            }
        }
        campaigns
    }

    /// Get donations for a campaign
    pub fn get_donations(env: Env, campaign_id: u64) -> Vec<Donation> {
        env.storage().instance()
            .get(&DataKey::Donations(campaign_id))
            .unwrap_or(Vec::new(&env))
    }

    /// Withdraw funds (only campaign creator)
    pub fn withdraw(env: Env, campaign_id: u64, creator: Address) -> i128 {
        creator.require_auth();

        let campaign: Campaign = env.storage().instance()
            .get(&DataKey::Campaign(campaign_id))
            .expect("Campaign not found");

        assert!(campaign.creator == creator, "Only creator can withdraw");
        assert!(!campaign.active || env.ledger().timestamp() >= campaign.deadline, 
                "Campaign still active");

        campaign.raised
    }
}

mod test;
