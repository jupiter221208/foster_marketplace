import React from 'react'

// styles
import styles from './index.module.scss'

import SearchGrayIcon from 'assets/icons/search-gray.svg?component'

const FollowSearchBox = props => {
  const { value, onChange } = props
  return (
    <div className={styles.container}>
      <div className={styles.iconArea}>
        <SearchGrayIcon className="cursor-pointer" />
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
