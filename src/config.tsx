export const contractAddress =
  'erd1qqqqqqqqqqqqqpgq72l6vl07fkn3alyfq753mcy4nakm0l72396qkcud5x';

export const dAppName = 'example Dapp';

export const walletConnectBridge =
  'https://devnet-wallet-connect.elrond.com/wallet-connect-0';

// Generate your own WalletConnect 2 ProjectId here: https://cloud.walletconnect.com/app
export const walletConnectV2ProjectId = '9b1a9564f91cb659ffe21b73d5c4e2d8';

export const apiTimeout = 6000;
export const transactionSize = 15;
export const timeout = 10000;

export const maiarIdApi = 'https://devnet-id.maiar.com/api/v1';

export const network: any & {
  graphQlAddress: string;
} = {
  id: 'devnet',
  name: 'Devnet',
  egldLabel: 'xEGLD',
  walletAddress: 'https://devnet-wallet.elrond.com',
  apiAddress: 'https://devnet-api.elrond.com',
  explorerAddress: 'http://devnet-explorer.elrond.com',
  graphQlAddress: 'https://devnet-graphql.maiar.exchange/graphql',
  exchangeAddress: 'https://devnet.maiar.exchange'
};
