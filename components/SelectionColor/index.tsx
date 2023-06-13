import React from 'react'

// styles
import styles from './index.module.scss'

const SelectionColor = props => {
  const { label, data, selected, onSelect } = props
  return (
    <div className={styles.container}>
      <div className={styles.label}>{label}</div>
      <div className="flex gap-[10px]">
        {data.map((item, index) => (
          <div
            key={index}
            style={{
              background: item.name,
            }}
            className={`${item.name === selected ? styles.selected : styles.normal}`}
            onClick={() => onSelect(item)}
          ></div>
        ))}
      </div>
    </div>
  )
}

export default SelectionColor
