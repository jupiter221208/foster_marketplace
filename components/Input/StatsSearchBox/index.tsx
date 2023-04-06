import React from 'react'

// next components
import Image from 'next/image'

// import images and icons
import SearchGrayIcon from 'assets/icons/search-gray.svg?component'

// styles
import styles from './index.module.scss'

const StatsSearchBox = props => {
  const { value, placeholder, onChange } = props
  return (
    <div className={styles.container}>
      {/* <Image src={SearchGrayIcon} alt="" width="13" /> */}
      <SearchGrayIcon />
      <input
        className={styles.inputArea}
        value={value}
        placeholder={placeholder}
        onChange={event => onChange(event.target.value)}
      />
    </div>
  )
}

export default StatsSearchBox
