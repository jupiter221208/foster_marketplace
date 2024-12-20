import React from 'react'

// styles
import styles from './index.module.scss'

const TechniqueClipboardChip = props => {
  const { title, text, title2, text2, identifier } = props
  return (
    <div id={identifier} className={styles.container}>
      <div className={styles.title}>{title}</div>
      <div className={styles.text}>{text}</div>
      <div className="w-full h-[20px]" />
      <div className={styles.title}>{title2}</div>
      <div className={styles.text}>{text2}</div>
    </div>
  )
}

export default TechniqueClipboardChip
