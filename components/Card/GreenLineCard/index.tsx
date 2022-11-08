import React from 'react'

// styles
import styles from './index.module.scss'

const GreenLineCard = props => {
  const { content, linkText, link } = props
  return (
    <p className={styles.container}>
      {content}
      <a href={link} className={styles.link}>
        {linkText}
      </a>
    </p>
  )
}

export default GreenLineCard
