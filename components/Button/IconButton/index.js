import React from 'react'

// next components
import Image from 'next/image'

// styles
import styles from './index.module.scss'

const IconButton = props => {
  const { icon, label = '', fullWidth = false, onClick, color = '', backgroundColor, width = '', height = '' } = props
  return (
    <button
      type="button"
      className={styles.container}
      onClick={() => onClick()}
      style={{
        width: fullWidth ? '100%' : width,
        color: color,
        backgroundColor: backgroundColor,
        height: height,
      }}
    >
      <div className={styles.image}>
        <Image src={icon} alt="" />
      </div>
      {label}
    </button>
  )
}

export default IconButton
