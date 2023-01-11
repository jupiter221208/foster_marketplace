import React from 'react'

// styles
import styles from './index.module.scss'

const NoDataSection = props => {
  const { title, description } = props

  return (
    <section className={styles.container}>
      <div>
        <div className={styles.noDataTitle}>{title}</div>
        <div className={styles.noDataDesc}>{description}</div>
      </div>
    </section>
  )
}

export default NoDataSection
