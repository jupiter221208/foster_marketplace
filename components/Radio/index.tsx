import React from 'react'

// styles
import styles from './index.module.scss'

const Radio = props => {
  const { data, selected, onChange, direction = 'ltr', backgroundColor = '', borderRadius = '', padding = '' } = props

  return data.map((item, index) => (
    <div
      key={index}
      className="flex justify-between my-3 lg:my-4 gap-4 z-10"
      style={{ backgroundColor: backgroundColor, borderRadius: borderRadius, padding: padding }}
    >
      {direction === 'ltr' && (
        <input
          className={styles.radio}
          style={{ opacity: item.disabled ? 0.5 : 1 }}
          type="radio"
          id={item.id}
          checked={selected.id === item.id}
          onChange={() => onChange(item)}
          disabled={item.disabled !== undefined ? item.disabled : false}
        />
      )}
      <label
        className={`${styles.label} ${selected.id === item.id ? styles.selected : ''}`}
        htmlFor={item.id}
        onClick={() => (item.disabled !== undefined && item.disabled ? {} : onChange(item))}
        style={{ opacity: item.disabled ? 0.5 : 1 }}
      >
        {item.label}
      </label>
      {direction === 'rtl' && (
        <input
          className={styles.radio}
          style={{ opacity: item.disabled ? 0.5 : 1 }}
          type="radio"
          id={item.id}
          checked={selected.id === item.id}
          onChange={() => onChange(item)}
          disabled={item.disabled !== undefined ? item.disabled : false}
        />
      )}
    </div>
  ))
}

export default Radio
