import React from 'react'

// next components
import { useRouter } from 'next/router'

// styles
import styles from './index.module.scss'

const LinkTextButton = props => {
  const { label, link } = props
  const router = useRouter()

  return (
    <div className={styles.container} onClick={() => router.push(link)}>
      {label}
    </div>
  )
}

export default LinkTextButton
