import React from 'react'

// styles
import styles from './index.module.scss'

const NextStepCircle = props => {
  const { step } = props
  return <div className={styles.container}>{step}</div>
}

export default NextStepCircle
