import React from 'react'

// styles
import styles from './index.module.scss'

const MerchShopClipboardChip = props => {
  const { type = '', title, text, identifier } = props
  return (
    <div
      id={identifier}
      className={styles.container}
      style={{
        bottom: type === 'custom' ? '30px' : '60px',
      }}
    >
      <div className={styles.title}>{title}</div>
      <div className={styles.text}>{text}</div>
    </div>
  )
}

export default MerchShopClipboardChip
