import React, { useState } from 'react'

// styles
import styles from './index.module.scss'
import { useSelector } from 'react-redux'

const TabItem = props => {
  const { item, onChange } = props
  const [hover, setHover] = useState(false)
  const lightDarkMode = useSelector(state => (state as any).lightMode)

  return (
    <div className="relative">
      <div
        className={`${styles.container} ${item.selected ? styles.activeTab : styles.activeTab1}`}
        onClick={() => onChange(item)}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {item.label}
      </div>
    </div>
  )
}

export default TabItem
