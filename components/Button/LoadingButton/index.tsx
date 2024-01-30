import React from 'react'

// next components
import Image from 'next/image'

// third party components
import Lottie from 'lottie-react'
import LoadingIcon from 'assets/lottery/loader-new.json'

// styles
import styles from './index.module.scss'

const LoadingButton = props => {
  const {
    fullWidth,
    backgroundColor01 = 'var(--primary-btn-bg-right)',
    backgroundColor02 = 'var(--primary-btn-bg-right)',
    width = 160,
    height = 40,
    gradientDirection = 'left',
  } = props

  return (
    <button
      type="button"
      className={styles.container}
      style={{
        width: fullWidth ? '100%' : width,
        height,
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
