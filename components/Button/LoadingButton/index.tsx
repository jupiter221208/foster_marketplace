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
    backgroundColor01 = 'var(--place-bid-minimum-color)',
    backgroundColor02 = 'var(--place-bid-minimum-color)',
    borderRadius = 12,
    width = 160,
    height,
    gradientDirection = 'left',
    mobileLoading = false,
  } = props

  return (
    <button
      type="button"
      className={styles.container}
      style={{
        width: fullWidth ? '100%' : width,
        height,
        borderRadius,
        background: `linear-gradient(to ${gradientDirection}, ${backgroundColor01}, ${backgroundColor02})`,
      }}
    >
      <div className={`flex items-center ${mobileLoading ? 'w-[30px]' : 'w-[40px]'}`}>
        <Lottie animationData={LoadingIcon} loop={true} />
      </div>
    </button>
  )
}

export default LoadingButton
