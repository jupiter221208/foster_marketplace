import React from 'react'

// styles
import styles from './index.module.scss'

const ProductMenuItem = props => {
  const { data, selected, onChange, backgroundColor = '', borderRadius = '', padding = '', gap = 0 } = props

  return (
    <div className="flex flex-col" style={{ paddingTop: 0, marginBottom: 0, gap }}>
      {data.map((item, index) => (
        <div
          key={index}
          className="flex justify-between gap-4 z-10"
          style={{ backgroundColor: backgroundColor, borderRadius: borderRadius, padding: padding }}
        >
          <label
            className={`${styles.label} ${selected.id === item.id ? styles.selected : ''}`}
            htmlFor={item.id}
            onClick={() => (item.disabled !== undefined && item.disabled ? {} : onChange(item))}
            style={{ opacity: item.disabled ? 0.5 : 1 }}
          >
            {item.label}
          </label>
        </div>
      ))}
    </div>
  )
}

export default ProductMenuItem
