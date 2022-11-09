import React from 'react'

// next components
import Image from 'next/image'

// styles
import styles from './index.module.scss'

const Input = props => {
  const {
    value,
    placeholder,
    onChange,
    label = '',
    labelColor = '',
    labelIcon = '',
    label01 = '',
    label02 = '',
    error = '',
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
      {label !== '' && (
        <div className={styles.label} style={{ color: labelColor }}>
          {label}
          {labelIcon !== '' && <Image src={labelIcon} alt="" />}
        </div>
      )}
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
      {error !== '' ? <div className={styles.error}>{error}</div> : <div></div>}
    </div>
  )
}

export default Input
