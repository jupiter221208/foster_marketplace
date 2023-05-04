import React from 'react'

// styles
import styles from './index.module.scss'

const FilterButton = props => {
  const { label, onClick, selected, fullWidth, width = '', height = '' } = props
  return (
    <button
      type="button"
      onClick={() => onClick()}
      className={styles.container}
      style={{
        width: fullWidth ? '100%' : width,
        color: selected ? 'var(--day-btn-color)' : '#979EA2',
        background: selected ? 'linear-gradient(to bottom, var(--day-btn-bg-1), var(--day-btn-bg-2))' : 'transparent',
        height: height,
        fontFamily: selected ? 'Muli-Bold' : 'Muli-SemiBold',
      }}
    >
      {label}
    </button>
  )
}

export default FilterButton
