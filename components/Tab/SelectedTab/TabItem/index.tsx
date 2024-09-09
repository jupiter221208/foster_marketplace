import React, { useState } from 'react'
import { Tooltip } from 'react-tooltip'

// styles
import styles from './index.module.scss'

const TabItem = props => {
  const { item, onChange } = props
  return (
    <div>
      <button
        id={item?.coming_soon === true ? 'tab-button' + item?.id : ''}
        className={`${styles.container} ${item.selected ? styles.activeTab : styles.activeTab1}`}
        onClick={() => onChange(item)}
      >
        {item.label}
      </button>
      {item?.coming_soon === true && item.disabled === true && (
        <Tooltip
          className={styles.tooltip}
          noArrow={true}
          anchorSelect={'#tab-button' + item.id}
          content="This feature is not available but is coming soon."
        />
      )}
    </div>
  )
}

export default TabItem
