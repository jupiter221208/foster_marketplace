import React from 'react'

// next components
import Image from 'next/image'

// styles
import styles from './index.module.scss'

const TimeSlotButton = props => {
  const {
    label,
    onClick,
    fullWidth,
    color,
    backgroundColor01 = '#95DBD5',
    backgroundColor02 = '#4B6E6B',
    width = '',
    height = '',
    boxShadow = '',
    gradientDirection = 'left',
    fontFamily = '',
    fontSize = '',
    borderRadius = '',
    paddingLeft = '',
    paddingRight = '',
  } = props

  return (
    <button
      type="button"
      onClick={() => onClick()}
      className={styles.container}
      style={{
        width: fullWidth ? '100%' : width,
        color: color,
        background: `linear-gradient(to ${gradientDirection}, ${backgroundColor01}, ${backgroundColor02})`,
        height: height,
        fontFamily: fontFamily,
        fontSize: fontSize,
        borderRadius: borderRadius,
        paddingLeft: paddingLeft,
        paddingRight: paddingRight,
        boxShadow: boxShadow,
      }}
    >
      <div>{label}</div>
    </button>
  )
}

export default TimeSlotButton
