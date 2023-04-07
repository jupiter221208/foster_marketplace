import React from 'react'
import { useSelector } from 'react-redux'

// next components
import Image from 'next/image'

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
