import React from 'react'

// next components
import { useRouter } from 'next/router'

// styles
import styles from './index.module.scss'

const LinkTextButton = props => {
  const { label, link } = props
  const router = useRouter()

  return (
    <a target="_blank" href={link} rel="noopener noreferrer" className={styles.container}>
      {label}
    </a>
  )
}

export default LinkTextButton
