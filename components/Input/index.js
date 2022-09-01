import React from 'react'

// styles
import styles from './index.module.scss'

const Input = props => {
  const {
    value,
    placeholder,
    label01 = '',
    label02 = '',
    onChange,
    color = '',
    fullWidth = false,
    backgroundColor = '',
    borderColor = '',
    borderWidth = 0,
    width = '',
    height = '',
    type = '',
  } = props
  return (
    <div className="w-full">
      <input
        className={styles.container}
        value={value}
        type={type}
        placeholder={placeholder}
        onChange={event => onChange(event.target.value)}
        style={{ color, backgroundColor, borderColor, borderWidth, width: fullWidth ? '100%' : width, height }}
      />
      {label01 !== '' && (
        <div className="w-full flex justify-between px-6 gap-6">
          <div className={styles.label}>{label01}</div>
          <div className={styles.label}>{label02}</div>
        </div>
      )}
    </div>
  )
}

export default Input
