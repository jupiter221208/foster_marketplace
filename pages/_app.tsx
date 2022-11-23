import React from 'react'

// styles
import '@solana/wallet-adapter-react-ui/styles.css'
import 'assets/scss/global.scss'

import Providers from 'providers'

import { ContextProvider } from 'contexts/ContextProvider'

const MyApp = ({ Component, pageProps, cluster }) => {
  const getLayout = Component.getLayout || (page => page)

  return (
    <ContextProvider>
      <Providers>{getLayout(<Component {...pageProps} />)}</Providers>
    </ContextProvider>
  )
}

export default MyApp
