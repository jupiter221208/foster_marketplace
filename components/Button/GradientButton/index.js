import React from 'react'

// styles
import styles from './index.module.scss'

const GradientButton = props => {
  const { label, onClick, color, backgroundColor01, backgroundColor02, size } = props
  return (
    <button
      type="button"
      onClick={() => onClick()}
      className={styles.container}
      style={{
        color: color,
        background: `linear-gradient(to left, ${backgroundColor01}, ${backgroundColor02})`,
        height: size === 'h40' ? '40px' : '53px',
      }}
    >
      {label}
    </button>
  )
}

export default GradientButton
