import { ReactNode } from 'react'
import { Provider as StoreProvider } from 'react-redux'
import store from 'store'

export default function Providers({ children }: { children: ReactNode }) {
  return <StoreProvider store={store}>{children}</StoreProvider>
}
