import * as StellarSdk from '@stellar/stellar-sdk';

const NETWORK_PASSPHRASE = StellarSdk.Networks.TESTNET;
const HORIZON_URL = 'https://horizon-testnet.stellar.org';

export class StellarService {
  private server: StellarSdk.Horizon.Server;
  private contractId: string;

  constructor(contractId: string) {
    this.server = new StellarSdk.Horizon.Server(HORIZON_URL);
    this.contractId = contractId;
  }

  async getAccount(publicKey: string) {
    try {
      return await this.server.loadAccount(publicKey);
    } catch (error) {
      console.error('Error loading account:', error);
      throw error;
    }
  }

  async createCampaign(
    sourceKey: string,
    title: string,
    description: string,
    goal: string,
    durationDays: number
  ) {
    try {
      const sourceKeypair = StellarSdk.Keypair.fromSecret(sourceKey);
      const account = await this.getAccount(sourceKeypair.publicKey());

      // Build transaction
      const transaction = new StellarSdk.TransactionBuilder(account, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: NETWORK_PASSPHRASE,
      })
        .setTimeout(30)
        .build();

      transaction.sign(sourceKeypair);

      const result = await this.server.submitTransaction(transaction);
      return result;
    } catch (error) {
      console.error('Error creating campaign:', error);
      throw error;
    }
  }

  async donate(
    sourceKey: string,
    campaignId: number,
    amount: string
  ) {
    try {
      const sourceKeypair = StellarSdk.Keypair.fromSecret(sourceKey);
      const account = await this.getAccount(sourceKeypair.publicKey());

      const transaction = new StellarSdk.TransactionBuilder(account, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: NETWORK_PASSPHRASE,
      })
        .setTimeout(30)
        .build();

      transaction.sign(sourceKeypair);

      const result = await this.server.submitTransaction(transaction);
      return result;
    } catch (error) {
      console.error('Error donating:', error);
      throw error;
    }
  }

  async getCampaigns() {
    // Simulate fetching campaigns from contract
    return [
      {
        id: 1,
        creator: 'GAYMGXUQ2A3SYYJ4BK2IRROUXCEZUQVOOGLLU4V3GXMBEBHFXTCZ7V3I',
        title: 'Sample Campaign',
        description: 'This is a sample campaign',
        goal: '1000',
        raised: '250',
        deadline: Date.now() + 86400000 * 30,
        active: true,
      },
    ];
  }

  async fundAccount(publicKey: string) {
    try {
      const response = await fetch(
        `https://friendbot.stellar.org?addr=${encodeURIComponent(publicKey)}`
      );
      const responseJSON = await response.json();
      return responseJSON;
    } catch (error) {
      console.error('Error funding account:', error);
      throw error;
    }
  }

  generateKeypair() {
    return StellarSdk.Keypair.random();
  }

  isValidPublicKey(publicKey: string): boolean {
    return StellarSdk.StrKey.isValidEd25519PublicKey(publicKey);
  }

  isValidSecretKey(secretKey: string): boolean {
    return StellarSdk.StrKey.isValidEd25519SecretSeed(secretKey);
  }
}

export const stellarService = new StellarService(
  'CDUMMYCONTRACTIDXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
);
