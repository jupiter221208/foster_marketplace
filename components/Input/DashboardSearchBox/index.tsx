import React from 'react'

// next components
import Image from 'next/image'

// import images and icons
import SearchGrayIcon from 'assets/icons/search-gray.svg'

// styles
import styles from './index.module.scss'

const DashboardSearchBox = props => {
  const { value, placeholder, onChange, onClick } = props
  return (
    <div className={styles.container}>
      <Image src={SearchGrayIcon} alt="" className="cursor-pointer" onClick={() => onClick()} />
      <input
        className={styles.inputArea}
        value={value}
        placeholder={placeholder}
        onChange={event => onChange(event.target.value)}
      />
    </div>
  )
}

export default DashboardSearchBox
