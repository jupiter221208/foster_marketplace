import React from 'react'

// styles
import styles from './index.module.scss'

const Chip = props => {
  const { label } = props
  return <div className={styles.container}>{label}</div>
}

export default Chip
