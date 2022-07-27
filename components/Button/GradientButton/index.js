import React from 'react'

// styles
import styles from './index.module.scss'

const GradientButton = props => {
  const { label, onClick, fullWidth, color, backgroundColor01, backgroundColor02, width = '', height = '' } = props
  return (
    <button
      type="button"
      onClick={() => onClick()}
      className={styles.container}
      style={{
        width: fullWidth ? '100%' : width,
        color: color,
        background: `linear-gradient(to left, ${backgroundColor01}, ${backgroundColor02})`,
        height: height,
      }}
    >
      {label}
    </button>
  )
}

export default GradientButton
