import React from 'react'

// next components
import Image from 'next/image'

// styles
import styles from './index.module.scss'

const IconButtonWithSVG = props => {
  const {
    icon,
    fullWidth = false,
    onClick,
    color = '',
    backgroundColor,
    width = '',
    height = '',
    iconWidth,
    iconHeight,
    borderRadius,
    borderColor,
    borderWidth,
    opacity = '1',
    blured = false,
  } = props
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
        borderRadius: borderRadius,
        borderColor: borderColor,
        borderWidth: borderWidth,
        opacity: opacity,
      }}
    >
      <div className={styles.image}>{icon}</div>
    </button>
  )
}

export default IconButtonWithSVG
