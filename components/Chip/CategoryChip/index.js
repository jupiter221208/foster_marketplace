import React from 'react'

// styles
import styles from './index.module.scss'

const CategoryChip = props => {
  const { name } = props
  return <div className={styles.container}>{name}</div>
}

export default CategoryChip
