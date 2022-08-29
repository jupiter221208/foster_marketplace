import React from 'react'

// next components
import Image from 'next/image'

// import images and icons
import SearchGrayIcon from 'assets/icons/search-gray.svg'

// styles
import styles from './index.module.scss'

const ResourceSearchBox = props => {
  const { value, placeholder, onChange } = props
  return (
    <div className={styles.container}>
      <input
        className={styles.inputArea}
        value={value}
        placeholder={placeholder}
        onChange={event => onChange(event.target.value)}
      />
      <Image src={SearchGrayIcon} alt="" />
    </div>
  )
}

export default ResourceSearchBox
