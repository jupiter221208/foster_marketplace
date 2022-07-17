import React, { useEffect, useState } from 'react'

import { Provider } from 'react-redux'
import store from 'store.js'

// styles
import 'assets/scss/global.scss'

const MyApp = ({ Component, pageProps }) => {
  const getLayout = Component.getLayout || (page => page)
  const [viewport, setViewport] = useState('lg') // sm, md, lg, xl, 2xl

  useEffect(() => {
    if (window.innerWidth > 1536) {
      setViewport('2xl')
    } else if (window.innerWidth > 1280 && window.innerWidth <= 1536) {
      setViewport('xl')
    } else if (window.innerWidth > 1024 && window.innerWidth <= 1280) {
      setViewport('lg')
    } else if (window.innerWidth >= 768 && window.innerWidth <= 1024) {
      setViewport('md')
    } else {
      setViewport('sm')
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
      } else if (window.innerWidth >= 768 && window.innerWidth <= 1024) {
        setViewport('md')
      } else {
        setViewport('sm')
      }
    }
    window.addEventListener('resize', resizeFunction)
  }, [])

  return <Provider store={store}>{getLayout(<Component {...pageProps} viewport={viewport} />)}</Provider>
}

export default MyApp
