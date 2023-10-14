import React, { useState } from 'react'

// components
import StatsSearchBox from 'components/Input/StatsSearchBox'

// resources

// styles
import styles from './index.module.scss'

const SearchSection = props => {
  const { placeholder, searchWord, setSearchWord } = props

  return (
    <div className={styles.container}>
      <div className="w-full flex flex-wrap justify-between gap-[20px] items-center">
        <div className="w-[500px] flex items-center gap-2 justify-between">
          <StatsSearchBox value={searchWord} placeholder={placeholder} onChange={value => setSearchWord(value)} />
        </div>
      </div>
    </div>
  )
}

export default SearchSection
