import React from 'react'

// next components
import { useRouter } from 'next/router'

// styles
import styles from './index.module.scss'

const CategoryChip = props => {
  const { data } = props
  const router = useRouter()

  return (
    <div className={styles.container} onClick={/*() => router.push(`/category/${data.id}`)*/ () => {}}>
      {data.value}
    </div>
  )
}

export default CategoryChip
