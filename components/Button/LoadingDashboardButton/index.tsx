import React from 'react'

// next components
import Image from 'next/image'

// third party components
import Lottie from 'lottie-react'
import LoadingIcon from 'assets/lottery/loader-green.json'

// styles
import styles from './index.module.scss'

const LoadingDashboardButton = props => {
  const { fullWidth, width } = props

  return (
    <button
      type="button"
      className={styles.container}
      style={{
        width: fullWidth ? '100%' : width,
      }}
    >
      <div className="w-[30px]">
        <Lottie animationData={LoadingIcon} loop={true} />
      </div>
    </button>
  )
}

export default LoadingDashboardButton
