import React from 'react'
import { useSelector } from 'react-redux'

// styles
import styles from './index.module.scss'

const IconTabButton = props => {
  const { item, onChange } = props
  const lightDarkMode = useSelector(state => (state as any).lightMode)

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
