import React from 'react'

// styles
import styles from './index.module.scss'

const TimeSlotButton = props => {
  const {
    selected,
    label,
    onClick,
    fullWidth,
    width = '',
    height = '',
    boxShadow = '',
    fontFamily = '',
    fontSize = '',
    borderRadius = '',
    paddingLeft = '',
    paddingRight = '',
    className = '',
  } = props

  return (
    <button
      type="button"
      onClick={() => onClick()}
      className={`${styles.container} ${className}`}
      style={{
        width: fullWidth ? '100%' : width,
        color: `${selected ? 'var(--background-main-color)' : 'var(--main-bg-color)'}`,
        background: `${selected ? 'var(--main-icon-color)' : 'var(--background-main-color)'}`,
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
