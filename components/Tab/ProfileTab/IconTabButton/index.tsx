import React from 'react'

// styles
import styles from './index.module.scss'

const IconTabButton = props => {
  const { item, onChange } = props

  return (
    <div className="relative">
      <button
        className={`${styles.container} ${item.selected ? styles.activeTab : styles.inactiveTab}`}
        onClick={() => onChange(item)}
      >
        <div>{item.label}</div>
      </button>
    </div>
  )
}

export default IconTabButton
