import React from 'react'

// styles
import styles from './index.module.scss'

const Textarea = props => {
  const { value, placeholder, label, onChange, fullWidth = false, width = '', height = '' } = props
  return (
    <div className="w-full">
      <textarea
        className={styles.container}
        value={value}
        placeholder={placeholder}
        onChange={event => onChange(event.target.value)}
        style={{ width: fullWidth ? '100%' : width, height: height }}
      />
      <div className={styles.label}>{label}</div>
    </div>
  )
}

export default Textarea
