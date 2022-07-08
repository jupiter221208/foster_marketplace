import React, { useEffect, useState } from 'react'

import { Provider } from 'react-redux'
import store from 'store.js'

// styles
import 'assets/scss/global.scss'

const MyApp = ({ Component, pageProps }) => {
  const getLayout = Component.getLayout || (page => page)
  const [viewport, setViewport] = useState('desktop') // mobile, ipad, desktop

  useEffect(() => {
    if (window.innerWidth > 1024) {
      setViewport('desktop')
    } else if (window.innerWidth === 1024) {
      setViewport('ipad')
    } else {
      setViewport('mobile')
    }
  }, [])

  useEffect(() => {
    const resizeFunction = () => {
      if (window.innerWidth > 1024) {
        setViewport('desktop')
      } else if (window.innerWidth >= 768 && window.innerWidth <= 1024) {
        setViewport('ipad')
      } else {
        setViewport('mobile')
      }
    }
    window.addEventListener('resize', resizeFunction)
  }, [])

  return <Provider store={store}>{getLayout(<Component {...pageProps} viewport={viewport} />)}</Provider>
}

export default MyApp
