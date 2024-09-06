import React, { useEffect, useState } from 'react'

// third party components
import Lottie from 'lottie-react'
import LoadingIcon from 'assets/lottery/loader-green.json'
// json

// styles
import styles from './index.module.scss'

const LoadingElement = props => {
  const { text = '' } = props

  let loadingText = text
  const [showText, setShowText] = useState(loadingText)

  useEffect(() => {
    const timer = setInterval(() => {
      if (loadingText.length - text.length == 0) loadingText = text + '.'
      else if (loadingText.length - text.length == 1) loadingText = text + '..'
      else if (loadingText.length - text.length == 2) loadingText = text + '...'
      else loadingText = text
      setShowText(loadingText)
    }, 500)

    return () => {
      clearTimeout(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="w-full flex justify-center">
      <div className="flex gap-[15px]">
        <div className="w-[30px] h-[30px]">
          <Lottie width={30} height={30} animationData={LoadingIcon} loop={true} />
        </div>
        <div className={styles.loadingText}>{showText}</div>
      </div>
    </div>
  )
}

export default LoadingElement
