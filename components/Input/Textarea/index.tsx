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
    width = '',
    height = '',
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
        style={{ width: fullWidth ? '100%' : width, height: height, background: backgroundColor }}
      />
      <div className="w-full flex justify-between px-6 gap-6">
        <div className={styles.bottomLabel}>{label01}</div>
        <div className={styles.bottomLabel}>{label02}</div>
      </div>
    </div>
  )
}

export default Textarea
