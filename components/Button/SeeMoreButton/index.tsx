import React from 'react'

// next components

// styles
import styles from './index.module.scss'

const SeeMoreButton = props => {
  const { onClick } = props

  return (
    <button type="button" onClick={() => onClick()} className={`${styles.container} gap-2 xl:gap-4 whitespace-nowrap`}>
      <div>See More</div>
    </button>
  )
}

export default SeeMoreButton
