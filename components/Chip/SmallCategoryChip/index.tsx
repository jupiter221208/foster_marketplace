import React from 'react'

// styles
import styles from './index.module.scss'

const SmallCategoryChip = props => {
  const { data } = props

  return (
    data !== '' && (
      <div className={styles.container} onClick={/* () => router.push(`/category/${data.id}`) */ () => {}}>
        <span>{data}</span>
      </div>
    )
  )
}

export default SmallCategoryChip
