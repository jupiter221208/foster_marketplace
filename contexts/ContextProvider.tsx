import { WalletAdapterNetwork, WalletError } from '@solana/wallet-adapter-base'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletModalProvider as ReactUIWalletModalProvider } from '@solana/wallet-adapter-react-ui'
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  SolletExtensionWalletAdapter,
  SolletWalletAdapter,
  TorusWalletAdapter,
  GlowWalletAdapter,
  BackpackWalletAdapter,
  // LedgerWalletAdapter,
  // SlopeWalletAdapter,
} from '@solana/wallet-adapter-wallets'
import { clusterApiUrl } from '@solana/web3.js'
import { FC, ReactNode, useCallback, useMemo } from 'react'
import { AutoConnectProvider, useAutoConnect } from './AutoConnectProvider'

const WALLET_ADAPTER_NETWORK = process.env.WALLET_ADAPTER_NETWORK

const WalletContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { autoConnect } = useAutoConnect()

  let network = WalletAdapterNetwork.Mainnet

  switch (WALLET_ADAPTER_NETWORK) {
    case 'devnet':
      network = WalletAdapterNetwork.Devnet
      break
    case 'testnet':
      network = WalletAdapterNetwork.Testnet
      break
    default:
      network = WalletAdapterNetwork.Mainnet
      break
  }

  const endpoint = process.env.PROVIDER_URL ?? clusterApiUrl(network)

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      // new SolflareWalletAdapter({ network }),
      new SolletWalletAdapter({ network }),
      new SolletExtensionWalletAdapter({ network }),
      new TorusWalletAdapter(),
      new GlowWalletAdapter(),
      new BackpackWalletAdapter(),
      // new LedgerWalletAdapter(),
      // new SlopeWalletAdapter(),
    ],
    [network]
  )

  const onError = useCallback((error: WalletError) => {
    // notify({ type: 'error', message: error.message ? `${error.name}: ${error.message}` : error.name });
    console.error(error)
  }, [])

  return (
    // TODO: updates needed for updating and referencing endpoint: wallet adapter rework
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} onError={onError} autoConnect={autoConnect}>
        <ReactUIWalletModalProvider>{children}</ReactUIWalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}

export const ContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <AutoConnectProvider>
      <WalletContextProvider>{children}</WalletContextProvider>
    </AutoConnectProvider>
  )
}
