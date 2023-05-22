import React, { useState } from 'react'

// styles
import styles from './index.module.scss'

const DaoStatusButton = props => {
  const { label } = props
  return <div className={styles.liveBtn}>{label}</div>
}

export default DaoStatusButton
