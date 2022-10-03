import React from 'react'

// styles
import styles from './index.module.scss'

const Input = props => {
  const {
    value,
    placeholder,
    label = '',
    label01 = '',
    label02 = '',
    error = '',
    onChange,
    color = '',
    fullWidth = false,
    backgroundColor = '',
    borderColor = '',
    borderRadius = '',
    width = '',
    height = '',
    type = '',
  } = props
  return (
    <div className="w-full">
      {label !== '' && <div className={styles.label}>{label}</div>}
      <input
        className={styles.container}
        value={value}
        type={type}
        placeholder={placeholder}
        onChange={event => onChange(event.target.value)}
        style={{ color, backgroundColor, borderColor, borderRadius, width: fullWidth ? '100%' : width, height }}
      />
      {label01 !== '' && (
        <div className="w-full flex justify-between px-6 gap-6">
          <div className={styles.bottomLabel}>{label01}</div>
          <div className={styles.bottomLabel}>{label02}</div>
        </div>
      )}
      {error !== '' ? <div className={styles.error}>{error}</div> : <div className="w-full h-[26px]"></div>}
    </div>
  )
}

export default Input
