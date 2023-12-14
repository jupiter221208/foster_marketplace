import React from 'react'

// styles
import styles from './index.module.scss'
import { getFirstUpperString } from 'utils/helpers'

const StudioSelectionColor = props => {
  const { label, data, selected, onSelect } = props

  return (
    <div className={styles.container}>
      <div className="flex gap-[10px] lg:gap-[15px]">
        {data.map((itemData, index) => (
          <div
            key={index}
            className={`${itemData.type === selected ? styles.selected : styles.normal}`}
            onClick={() => {
              onSelect(itemData)
            }}
          >
            <img src={itemData.asset_url} className="w-full h-full" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default StudioSelectionColor
