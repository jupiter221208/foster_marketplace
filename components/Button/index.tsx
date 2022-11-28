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
  } = props
  return (
    <button
      type="button"
      onClick={() => onClick()}
      className={styles.container}
      disabled={disabled}
      style={{
        width: fullWidth ? '100%' : width,
        color: color,
        backgroundColor: backgroundColor,
        height: height,
        fontSize: fontSize,
      }}
    >
      {label}
    </button>
  )
}

export default Button
