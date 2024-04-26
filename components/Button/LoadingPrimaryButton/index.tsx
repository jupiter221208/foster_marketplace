import React from 'react'

// next components
import Image from 'next/image'

// third party components
import Lottie from 'lottie-react'
import LoadingIcon from 'assets/lottery/loader-black.json'

// styles
import styles from './index.module.scss'

const LoadingPrimaryButton = props => {
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
      <div>Transaction Processing</div>
    </button>
  )
}

export default LoadingPrimaryButton
