import React from 'react'

// styles
import styles from './index.module.scss'

const Radio = props => {
  const { data, selected, onChange, direction = 'ltr' } = props

  return data.map((item, index) => (
    <div key={index} className="flex justify-between my-4 gap-4 z-10">
      {direction === 'ltr' && (
        <input
          className={styles.radio}
          type="radio"
          id={item.id}
          checked={selected.id === item.id}
          onChange={() => onChange(item)}
        />
      )}
      <label className={styles.label} htmlFor={item.id} onClick={() => onChange(item)}>
        {item.label}
      </label>
      {direction === 'rtl' && (
        <input
          className={styles.radio}
          type="radio"
          id={item.id}
          checked={selected.id === item.id}
          onChange={() => onChange(item)}
        />
      )}
    </div>
  ))
}

export default Radio
