import React from 'react'

// next components
import Image from 'next/image'

// styles
import styles from './index.module.scss'

const IconButton = props => {
  const { icon, onClick, backgroundColor } = props
  return (
    <button
      type="button"
      className={styles.container}
      onClick={() => onClick()}
      style={{
        backgroundColor: backgroundColor,
      }}
    >
      <Image src={icon} alt="" />
    </button>
  )
}

export default IconButton
