import React from 'react'

// next components
import Image from 'next/image'

// third party components
import Lottie from 'lottie-react'
import LoadingIcon from 'assets/lottery/loader-black.json'

// styles
import styles from './index.module.scss'

const LoadingButton = props => {
  const {
    fullWidth,
    backgroundColor01 = '#5ac3ba',
    backgroundColor02 = '#378287',
    width = 160,
    gradientDirection = 'left',
    icon = '',
  } = props

  return (
    <button
      type="button"
      className={styles.container}
      style={{
        width: fullWidth ? '100%' : width,
        background: `linear-gradient(to ${gradientDirection}, ${backgroundColor01}, ${backgroundColor02})`,
      }}
    >
      <div className="flex items-center w-[40px]">
        <Lottie animationData={LoadingIcon} loop={true} />
      </div>
    </button>
  )
}

export default LoadingButton
