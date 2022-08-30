import React from 'react'

// styles
import styles from './index.module.scss'

const GreenLineCard = props => {
  const { content } = props
  return <div className={styles.container}>{content}</div>
}

export default GreenLineCard
