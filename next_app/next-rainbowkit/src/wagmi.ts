import { getDefaultWallets } from '@rainbow-me/rainbowkit'
import { configureChains, createConfig } from 'wagmi'
import { polygonMumbai, sepolia } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'

const walletConnectProjectId = '0'

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [sepolia, ...(process.env.NODE_ENV === 'development' ? [sepolia] : [])],
  [
    publicProvider(),
  ],
)

const { connectors } = getDefaultWallets({
  appName: 'My wagmi + RainbowKit App',
  chains,
  projectId: walletConnectProjectId,
})

export const config = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
})

export { chains }
