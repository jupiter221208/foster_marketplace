import React from 'react'

// styles
import styles from './index.module.scss'

const RatingBar = props => {
  const { value = 0, outOf = 5 } = props
  const percentage = (value / outOf) * 100

  return (
    <div className={styles.starRating}>
      <div className={styles.starsOuter}>
        <div className={styles.starsInner} style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  )
}

export default RatingBar
