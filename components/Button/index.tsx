import React from 'react'

// styles
import styles from './index.module.scss'

const Button = props => {
  const {
    label,
    onClick,
    fullWidth,
    disabled = false,
    width = '',
    color,
    backgroundColor,
    height = '',
    fontSize = '',
    fontFamily,
    borderRadius = '',
    borderColor = '',
    paddingLeft = '',
    paddingRight = '',
  } = props
  return (
    <button
      type="button"
      onClick={() => onClick()}
      className={styles.container}
      disabled={disabled}
      style={{
        fontFamily: fontFamily,
        width: fullWidth ? '100%' : width,
        color: color,
        backgroundColor: backgroundColor,
        height: height,
        fontSize: fontSize,
        borderColor: borderColor,
        borderRadius: borderRadius,
        paddingLeft: paddingLeft,
        paddingRight: paddingRight,
      }}
    >
      {label}
    </button>
  )
}

export default Button
