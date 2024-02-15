import React from 'react'

// styles
import styles from './index.module.scss'
import { getFirstUpperString } from 'utils/helpers'

const SelectionColor = props => {
  const { label, data, selected, onSelect } = props

  return (
    <div className={styles.container}>
      <div className={styles.label}>
        {label}
        <div className="lg:hidden block">
          <div className={styles.labelText}>&nbsp;{getFirstUpperString(selected)}</div>
        </div>
      </div>
      <div className="flex gap-[15px] lg:gap-[27px]">
        {data.map((item, index) => (
          <div
            key={index}
            className={`${item.type === selected ? styles.selected : styles.normal}`}
            onClick={() => onSelect(item)}
          >
            {/* <img src={item.asset_url} className="w-full h-full" /> */}
            <div style={{ background: item.name, width: '100%', height: '100%', borderRadius: '33px' }} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default SelectionColor
