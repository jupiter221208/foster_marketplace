import React from 'react'

// styles
import styles from './index.module.scss'

const OutlineButton = props => {
  const { label, onClick, fullWidth, color, borderColor, size } = props
  return (
    <button
      type="button"
      onClick={() => onClick()}
      className={styles.container}
      style={{
        color: color,
        borderColor: borderColor,
        height: size === 'h40' ? '40px' : '53px',
        width: fullWidth ? '100%' : 'auto',
        fontSize: size === 'h40' ? '12px' : '18px',
      }}
    >
      {label}
    </button>
  )
}

export default OutlineButton
