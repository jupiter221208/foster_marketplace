import React from 'react'

// styles
import styles from './index.module.scss'

const CopyClipboardChip = props => {
  const { identifier, height, fontSize } = props
  return (
    <div id={identifier} className={styles.container} style={{ height: height, fontSize: fontSize }}>
      Copied!
    </div>
  )
}

export default CopyClipboardChip
