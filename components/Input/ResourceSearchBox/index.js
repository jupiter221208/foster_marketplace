import React from 'react'

// next components
import Image from 'next/image'

// import images and icons
import SearchGrayIcon from 'assets/icons/search-gray.svg'
import CloseWhiteIcon from 'assets/icons/close-white.svg'

// styles
import styles from './index.module.scss'

const ResourceSearchBox = props => {
  const { value, placeholder, onChange, viewport = 'sm' } = props
  return (
    <div className={styles.container}>
      <input
        className={styles.inputArea}
        value={value}
        placeholder={placeholder}
        onChange={event => onChange(event.target.value)}
      />
      <Image
        src={viewport === 'sm' || viewport === 'md' ? CloseWhiteIcon : SearchGrayIcon}
        alt=""
        className="cursor-pointer"
      />
    </div>
  )
}

export default ResourceSearchBox
