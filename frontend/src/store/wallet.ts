import { create } from 'zustand';

export interface Campaign {
  id: number;
  creator: string;
  title: string;
  description: string;
  goal: string;
  raised: string;
  deadline: number;
  active: boolean;
}

interface WalletState {
  publicKey: string | null;
  secretKey: string | null;
  isConnected: boolean;
  campaigns: Campaign[];
  setWallet: (publicKey: string, secretKey: string) => void;
  disconnect: () => void;
  setCampaigns: (campaigns: Campaign[]) => void;
  addCampaign: (campaign: Campaign) => void;
}

export const useWalletStore = create<WalletState>((set) => ({
  publicKey: null,
  secretKey: null,
  isConnected: false,
  campaigns: [],
  
  setWallet: (publicKey, secretKey) =>
    set({ publicKey, secretKey, isConnected: true }),
  
  disconnect: () =>
    set({ publicKey: null, secretKey: null, isConnected: false }),
  
  setCampaigns: (campaigns) =>
    set({ campaigns }),
  
  addCampaign: (campaign) =>
    set((state) => ({ campaigns: [...state.campaigns, campaign] })),
}));
