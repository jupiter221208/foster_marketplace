import React from 'react'
import { useSelector } from 'react-redux'

// styles
import styles from './index.module.scss'

const CategoryChip = props => {
  const { data } = props
  const lightMode = useSelector(state => (state as any).lightMode)

  return (
    <div className={`${styles.container} ${lightMode ? styles.lightColor : ''}`} onClick={() => {}}>
      {data.value}
    </div>
  )
}

export default CategoryChip
