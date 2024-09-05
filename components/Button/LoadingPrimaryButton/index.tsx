import React from 'react'

// next components

// third party components
import Lottie from 'lottie-react'
import LoadingIcon from 'assets/lottery/loader-green.json'

// styles
import styles from './index.module.scss'

const LoadingPrimaryButton = props => {
  const { fullWidth, width, height = 50, borderRadius = 10, text = 'Transaction Processing' } = props

  return (
    <button
      type="button"
      className={styles.container}
      style={{
        width: fullWidth ? '100%' : width,
        height: height,
        borderRadius: borderRadius,
      }}
    >
      <div className="w-[30px]">
        <Lottie animationData={LoadingIcon} loop={true} />
      </div>
      <div>{text}</div>
    </button>
  )
}

export default LoadingPrimaryButton
