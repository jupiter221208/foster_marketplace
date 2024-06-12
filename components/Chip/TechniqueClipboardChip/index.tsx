import React from 'react'

// styles
import styles from './index.module.scss'

const TechniqueClipboardChip = props => {
  const { title, text, identifier } = props
  return (
    <div id={identifier} className={styles.container}>
      <div className={styles.title}>{title}</div>
      <div className={styles.text}>{text}</div>
    </div>
  )
}

export default TechniqueClipboardChip
