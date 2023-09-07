import React from 'react'

// styles
import styles from './index.module.scss'
import { useViewport } from 'utils'
import { getFirstUpperString } from 'utils/helpers'

const Selection = props => {
  const { label, data, selected, onSelect } = props

  return (
    <div className={styles.container}>
      <div className="w-full lg:flex hidden">
        <div className={styles.label}>{label}</div>
        <div className="flex gap-[30px]">
          {data.map((item, index) => (
            <div
              key={index}
              className={item.name === selected ? styles.selected : styles.normal}
              onClick={() => onSelect(item)}
            >
              {item.name}
            </div>
          ))}
        </div>
      </div>

      <div className="w-full lg:hidden ">
        <div className={styles.label}>
          {label}&nbsp;
          <div className={styles.selectedLabel}>
            {!selected || selected.length === 0
              ? `Select ${getFirstUpperString(label.substring(0, label.length - 1).toLowerCase())}`
              : selected}
          </div>
        </div>
        <div className="flex flex-wrap gap-[5px] mt-[15px]">
          {data.map((item, index) => (
            <div
              key={index}
              className={item.name === selected ? styles.mobileSelected : styles.mobileNormal}
              onClick={() => onSelect(item)}
            >
              {item.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Selection
