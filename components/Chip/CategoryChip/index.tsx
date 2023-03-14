import React from 'react'

// styles
import styles from './index.module.scss'

const CategoryChip = props => {
  const { data } = props

  return (
    <div className={styles.container} onClick={() => {}}>
      {data.value}
    </div>
  )
}

export default CategoryChip
