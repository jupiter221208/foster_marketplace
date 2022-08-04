import React from 'react'

// styles
import styles from './index.module.scss'

const Input = props => {
  const {
    value,
    placeholder,
    label = '',
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
      {label !== '' && <div className={styles.label}>{label}</div>}
    </div>
  )
}

export default Input
