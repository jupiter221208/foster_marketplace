import React from 'react'

// styles
import styles from './index.module.scss'

const CopyClipboardChip = props => {
  const { identifier, height, fontSize, message = 'Copied' } = props
  return (
    <div id={identifier} className={styles.container} style={{ height: height, fontSize: fontSize }}>
      {message}
    </div>
  )
}

export default CopyClipboardChip
