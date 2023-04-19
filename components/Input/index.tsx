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
    labelIconWidth = '',
    labelIconHeight = '',
    label01 = '',
    label02 = '',
    error = '',
    color = '',
    fontSize = '16px',
    fullWidth = false,
    backgroundColor = '',
    borderColor = 'transparent',
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
          {labelIcon !== '' && <Image src={labelIcon} alt="" width={labelIconWidth} height={labelIconHeight} />}
        </div>
      )}
      <input
        className={styles.container}
        value={value}
        type={type}
        placeholder={placeholder}
        onChange={event => onChange(event.target.value)}
        style={{
          color,
          backgroundColor,
          borderColor,
          borderRadius,
          width: fullWidth ? '100%' : width,
          height,
          fontSize,
        }}
      />
      {label01 !== '' && (
        <div className="w-full flex justify-between gap-6">
          <div className={styles.bottomLabel}>{label01}</div>
          <div className={styles.bottomLabel}>{label02}</div>
        </div>
      )}
      {error !== '' ? <div className={styles.error}>{error}</div> : <div></div>}
    </div>
  )
}

export default Input
