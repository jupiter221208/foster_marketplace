import React from 'react'
import NextNProgress from 'nextjs-progressbar'

// styles
import '@solana/wallet-adapter-react-ui/styles.css'
import 'assets/scss/global.scss'
import 'react-tooltip/dist/react-tooltip.css'

import Providers from 'providers'

import { ContextProvider } from 'contexts/ContextProvider'

const MyApp = ({ Component, pageProps, cluster }) => {
  const getLayout = Component.getLayout || (page => page)

  return (
    <ContextProvider>
      <Providers>
        <div className="w-full mt-[100px]">
          <NextNProgress color="var(--main-icon-color)" options={{ showSpinner: false }} />
        </div>
        {getLayout(<Component {...pageProps} />)}
      </Providers>
    </ContextProvider>
  )
}

export default MyApp
