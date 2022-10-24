import React from 'react'

// styles
import styles from './index.module.scss'

const CategoryChip = props => {
  const { data } = props

  return (
    <div className={styles.container} onClick={/*() => router.push(`/category/${data.id}`)*/ () => {}}>
      {data.value}
    </div>
  )
}

export default CategoryChip
