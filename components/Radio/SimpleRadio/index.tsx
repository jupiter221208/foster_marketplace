import React from 'react'

// styles
import styles from './index.module.scss'

const Radio = props => {
  const {
    data,
    selected,
    onChange,
    direction = 'ltr',
    backgroundColor = '',
    borderRadius = '',
    padding = '',
    gap = '',
  } = props

  return (
    <div
      className="flex justify-between my-3 lg:my-4 gap-4 z-10"
      style={{ backgroundColor: backgroundColor, borderRadius: borderRadius, padding: padding }}
    >
      <input
        className={styles.radio}
        type="radio"
        onChange={() => onChange()}
        // disabled={item.disabled !== undefined ? item.disabled : false}
        disabled
      />
      <label
        className={styles.label}
        // onClick={() => (item.disabled !== undefined && item.disabled ? {} : onChange())}
        // style={{ opacity: item.disabled ? 0.5 : 1 }}
      >
        Use same address from previous order
      </label>
    </div>
  )
}

export default Radio
