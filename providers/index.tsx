import { ReactNode, useMemo } from 'react'
import { Provider as StoreProvider } from 'react-redux'
import store from 'store'
import { EnvironmentProvider } from './EnvironmentProvider'
import { WalletProvider } from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  SolletWalletAdapter,
  LedgerWalletAdapter,
  SlopeWalletAdapter,
  CloverWalletAdapter,
} from '@solana/wallet-adapter-wallets'

export default function Providers({ children, cluster }: { children: ReactNode; cluster: string }) {
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new SolletWalletAdapter(),
      new LedgerWalletAdapter(),
      new SlopeWalletAdapter(),
      new CloverWalletAdapter(),
    ],
    []
  )

  return (
    <StoreProvider store={store}>
      <EnvironmentProvider defaultCluster={cluster}>
        <WalletProvider autoConnect wallets={wallets}>
          <WalletModalProvider>{children}</WalletModalProvider>
        </WalletProvider>
      </EnvironmentProvider>
    </StoreProvider>
  )
}
