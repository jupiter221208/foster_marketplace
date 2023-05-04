import React from 'react'

// next components

// import images and icons
import SearchGrayIcon from 'assets/icons/search-gray.svg?component'

// styles
import styles from './index.module.scss'

const NotificationsSearchBox = props => {
  const { value, placeholder, onChange, onClick } = props
  return (
    <div className={styles.container}>
      <input
        className={styles.inputArea}
        value={value}
        placeholder={placeholder}
        onChange={event => onChange(event.target.value)}
      />
      <SearchGrayIcon alt="" className="cursor-pointer" onClick={() => onClick()} />
    </div>
  )
}

export default NotificationsSearchBox
