import React, { useEffect, useState } from 'react'

// styles
import '@solana/wallet-adapter-react-ui/styles.css'
import 'assets/scss/global.scss'

import Providers from 'providers'

import { ContextProvider } from 'contexts/ContextProvider'

const MyApp = ({ Component, pageProps, cluster }) => {
  const getLayout = Component.getLayout || (page => page)
  const [viewport, setViewport] = useState('lg') // xs, sm, md, lg, xl, 2xl

  useEffect(() => {
    if (window.innerWidth > 1536) {
      setViewport('2xl')
    } else if (window.innerWidth > 1280 && window.innerWidth <= 1536) {
      setViewport('xl')
    } else if (window.innerWidth > 1024 && window.innerWidth <= 1280) {
      setViewport('lg')
    } else if (window.innerWidth > 768 && window.innerWidth <= 1024) {
      setViewport('md')
    } else if (window.innerWidth >= 640 && window.innerWidth <= 768) {
      setViewport('sm')
    } else {
      setViewport('xs')
    }
  }, [])

  useEffect(() => {
    const resizeFunction = () => {
      if (window.innerWidth > 1536) {
        setViewport('2xl')
      } else if (window.innerWidth > 1280 && window.innerWidth <= 1536) {
        setViewport('xl')
      } else if (window.innerWidth > 1024 && window.innerWidth <= 1280) {
        setViewport('lg')
      } else if (window.innerWidth > 768 && window.innerWidth <= 1024) {
        setViewport('md')
      } else if (window.innerWidth >= 640 && window.innerWidth <= 768) {
        setViewport('sm')
      } else {
        setViewport('xs')
      }
    }
    window.addEventListener('resize', resizeFunction)
  }, [])

  return (
    <ContextProvider>
      <Providers>{getLayout(<Component {...pageProps} />)}</Providers>
    </ContextProvider>
  )
}

export default MyApp
