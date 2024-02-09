import React, { useState } from 'react'

// third party component
import { Tab as HTab } from '@headlessui/react'

// styles
import styles from './index.module.scss'

const TabItem = props => {
  const { item, onChange, type } = props
  const [hover, setHover] = useState(false)

  return (
    <div className="relative">
      <button
        className={`${styles.container} ${
          item.selected ? (type === 'image' ? styles.activeTab : styles.activeAudioTab) : styles.activeTab1
        }`}
        onClick={() => onChange(item)}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {item.label}
      </button>
      {item?.coming_soon && hover && (
        <div className={styles.tooltip}>This feature is not available but is coming soon.</div>
      )}
    </div>
  )
}

export default TabItem
