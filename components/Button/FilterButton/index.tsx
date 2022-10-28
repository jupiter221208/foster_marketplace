import React from 'react'

// styles
import styles from './index.module.scss'

const FilterButton = props => {
  const { label, onClick, fullWidth, disabled = false, width = '', color, background, height = '' } = props
  return (
    <button
      type="button"
      onClick={() => onClick()}
      className={styles.container}
      disabled={disabled}
      style={{
        width: fullWidth ? '100%' : width,
        color: color,
        background: background,
        height: height,
      }}
    >
      {label}
    </button>
  )
}

export default FilterButton
