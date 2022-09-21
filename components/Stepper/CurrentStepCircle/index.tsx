import React from 'react'

// styles
import styles from './index.module.scss'

const CurrentStepCircle = props => {
  const { step } = props
  return (
    <div className={styles.outerCircle}>
      <div className={styles.innerCircle}>{step}</div>
    </div>
  )
}

export default CurrentStepCircle
