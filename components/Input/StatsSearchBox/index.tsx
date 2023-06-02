import React from 'react'

// next components

// import images and icons
import SearchGrayIcon from 'assets/icons/search-gray.svg?component'

// styles
import styles from './index.module.scss'

const StatsSearchBox = props => {
  const { value, placeholder, onChange, onCancel } = props
  return (
    <div className={styles.container}>
      <SearchGrayIcon />
      <input
        className={styles.inputArea}
        value={value}
        placeholder={placeholder}
        onChange={event => onChange(event.target.value)}
      />
      {value?.length > 0 && (
        <div
          className={styles.cancel}
          onClick={() => {
            onChange('')
            onCancel()
          }}
        >
          Cancel
        </div>
      )}
    </div>
  )
}

export default StatsSearchBox
