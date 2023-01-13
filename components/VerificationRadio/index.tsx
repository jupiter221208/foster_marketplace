import React from 'react'

// styles
import styles from './index.module.scss'

const VerificationRadio = props => {
  const { data, selected, onChange, direction = 'ltr' } = props

  return data.map((item, index) => (
    <div key={index} className={styles.container}>
      <input
        className={styles.radio}
        style={{ opacity: item.disabled ? 0.5 : 1 }}
        type="radio"
        id={item.id}
        checked={selected.id === item.id}
        onChange={() => onChange(item)}
        disabled={item.disabled !== undefined ? item.disabled : false}
      />

      <label
        className={styles.label}
        htmlFor={item.id}
        onClick={() => (item.disabled !== undefined && item.disabled ? {} : onChange(item))}
        style={{ opacity: item.disabled ? 0.5 : 1 }}
      >
        {item.label}
      </label>
    </div>
  ))
}

export default VerificationRadio
