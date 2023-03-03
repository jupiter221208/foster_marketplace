import React, { useState } from 'react'

import { useViewport } from 'utils'

// third party component
import { Tab as HTab } from '@headlessui/react'

// styles
import styles from './index.module.scss'
import { useSelector } from 'react-redux'

const TabItem = props => {
  const { item, onChange } = props
  const viewport = useViewport()
  const [hover, setHover] = useState(false)
  const lightMode = useSelector(state => (state as any).lightMode)

  return (
    <div className="relative">
      <button
        className={`${styles.container} ${lightMode ? styles.lightColor : ''} ${item.selected ? styles.activeTab : ''}`}
        onClick={() => onChange(item)}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {item.label}
      </button>
      {item.selected && <div className={styles.underline}></div>}

      {viewport !== 'xs' && viewport !== 'md' && viewport !== 'sm' && item?.coming_soon && hover && (
        <div className={`${styles.tooltip} ${lightMode ? styles.lightTooltip : ''}`}>
          This feature is not available but is coming soon.
        </div>
      )}
    </div>
  )
}

export default TabItem
