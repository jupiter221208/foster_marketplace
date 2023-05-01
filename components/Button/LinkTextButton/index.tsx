import React from 'react'

// styles
import styles from './index.module.scss'

const LinkTextButton = props => {
  const { label, link } = props

  return (
    <a target="_blank" href={link} rel="noopener noreferrer" className={styles.container}>
      {label}
    </a>
  )
}

export default LinkTextButton
