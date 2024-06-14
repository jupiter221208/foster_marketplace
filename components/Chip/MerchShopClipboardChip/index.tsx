import React from 'react'

// styles
import styles from './index.module.scss'

const MerchShopClipboardChip = props => {
  const { width = null, type = 'custom', title, text, identifier } = props
  return (
    <div
      id={identifier}
      className={styles.container}
      style={{
        width: width && width,
        bottom: type === 'custom' ? '30px' : '60px',
      }}
    >
      <div className={styles.title}>{title}</div>
      <div className={styles.text}>{text}</div>
    </div>
  )
}

export default MerchShopClipboardChip
