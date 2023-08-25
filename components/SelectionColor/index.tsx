import React from 'react'

// styles
import styles from './index.module.scss'
import { getFirstUpperString } from 'utils/helpers'

const SelectionColor = props => {
  const { label, data, selected, onSelect } = props
  console.log(selected, '========color======')
  return (
    <div className={styles.container}>
      <div className={styles.label}>
        {label}
        <div className="lg:hidden block">&nbsp;{getFirstUpperString(selected)}</div>
      </div>
      <div className="flex gap-[15px] lg:gap-[27px]">
        {data.map((item, index) => (
          <div
            key={index}
            className={`${item.type === selected ? styles.selected : styles.normal}`}
            onClick={() => onSelect(item)}
          >
            <img src={item.asset_url} className="w-full h-full" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default SelectionColor
