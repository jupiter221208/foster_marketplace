import React, { useState } from 'react'

// third party component
import { Tab as HTab } from '@headlessui/react'

// styles
import styles from './index.module.scss'

const TabItem = props => {
  const { item, onChange } = props
  const [hover, setHover] = useState(false)
  return (
    <div className="relative">
      <button
        className={`${styles.container}`}
        onClick={() => onChange(item)}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div className={`${item.selected ? styles.activeTab : ''}`}>{item.label}</div>
      </button>
      {item?.coming_soon && hover && (
        <div className={styles.tooltip}>This feature is not available but is coming soon.</div>
      )}
    </div>
  )
}

export default TabItem
