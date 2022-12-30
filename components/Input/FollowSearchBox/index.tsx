import React from 'react'

// styles
import styles from './index.module.scss'

import SearchGrayIcon from 'assets/icons/search-gray.svg'
import Image from 'next/image'

const FollowSearchBox = props => {
  const { value, onChange } = props
  return (
    <div className={styles.container}>
      <div className={styles.iconArea}>
        <Image src={SearchGrayIcon} alt="" />
      </div>
      <input
        className={styles.inputArea}
        value={value}
        placeholder={'Search'}
        onChange={event => onChange(event.target.value)}
      />
    </div>
  )
}

export default FollowSearchBox
