import React from 'react'

// next components
import Image from 'next/image'

// styles
import styles from './index.module.scss'

const Textarea = props => {
  const {
    value,
    placeholder,
    label = '',
    labelIcon = '',
    labelColor = '',
    label01 = '',
    label02 = '',
    backgroundColor,
    onChange,
    fullWidth = false,
    fontSize = '16px',
    color = '',
    width = '',
    height = '',
    maxHeight = '',
  } = props
  return (
    <div className="w-full">
      {label !== '' && (
        <div className={styles.label} style={{ color: labelColor }}>
          {label}
          {labelIcon !== '' && <Image src={labelIcon} alt="" />}
        </div>
      )}
      <textarea
        className={styles.container}
        value={value}
        placeholder={placeholder}
        onChange={event => onChange(event.target.value)}
        style={{
          width: fullWidth ? '100%' : width,
          height: height,
          maxHeight: maxHeight,
          background: backgroundColor,
          fontSize: fontSize,
          color: color,
        }}
      />
      {(label01 !== '' || label02 !== '') && (
        <div className="w-full flex justify-between gap-6">
          <div className={styles.bottomLabel}>{label01}</div>
          <div className={styles.bottomLabel}>{label02}</div>
        </div>
      )}
    </div>
  )
}

export default Textarea
