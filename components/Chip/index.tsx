import React from 'react'

// styles
import styles from './index.module.scss'

const Chip = props => {
  const { data } = props
  return <div className={styles.container}>{data.name}</div>
}

export default Chip
