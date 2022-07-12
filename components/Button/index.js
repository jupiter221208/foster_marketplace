import React from 'react'

// styles
import styles from './index.module.scss'

const Button = props => {
  const { label, onClick, color, backgroundColor } = props
  return (
    <button
      type="button"
      onClick={() => onClick()}
      className={styles.container}
      style={{
        color: color,
        background: backgroundColor,
      }}
    >
      {label}
    </button>
  )
}

export default Button
