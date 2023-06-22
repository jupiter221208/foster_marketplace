import React, { useState, useEffect } from 'react'

// styles
import styles from './index.module.scss'

const WalletTag = props => {
  const { item, setSelect } = props
  return (
    <div
      className={`${styles.container} ${item.selected === true ? styles.selected : styles.normal}`}
      onClick={() => setSelect(item)}
    >
      {item.width}" X {item.height}"
    </div>
  )
}

export default WalletTag
