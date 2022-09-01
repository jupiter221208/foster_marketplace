import React from 'react'

// styles
import styles from './index.module.scss'

const Textarea = props => {
  const { value, placeholder, label01 = '', label02 = '', onChange, fullWidth = false, width = '', height = '' } = props
  return (
    <div className="w-full">
      <textarea
        className={styles.container}
        value={value}
        placeholder={placeholder}
        onChange={event => onChange(event.target.value)}
        style={{ width: fullWidth ? '100%' : width, height: height }}
      />
      <div className="w-full flex justify-between px-6 gap-6">
        <div className={styles.label}>{label01}</div>
        <div className={styles.label}>{label02}</div>
      </div>
    </div>
  )
}

export default Textarea
