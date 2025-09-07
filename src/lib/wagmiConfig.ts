import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, polygon, optimism, arbitrum, base, sepolia } from 'wagmi/chains';
import { type Chain } from 'wagmi/chains';

const irysChain: Chain = {
  id: 1270,
  name: 'Irys Testnet',
  nativeCurrency: {
    name: 'IRYS',
    symbol: 'IRYS',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://testnet-rpc.irys.xyz/v1/execution-rpc'],
    },
  },
  blockExplorers: {
    default: { name: 'Irys Explorer', url: 'https://explorer.irys.xyz' },
  },
};

export const config = getDefaultConfig({
  appName: 'RainbowKit demo',
  projectId: 'YOUR_PROJECT_ID',
  chains: [irysChain, mainnet, polygon, optimism, arbitrum, base, sepolia],
});