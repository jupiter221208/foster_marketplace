import React from 'react'

// components
import StatsSearchBox from 'components/Input/StatsSearchBox'

// resources

// styles
import styles from './index.module.scss'

const SearchSection = props => {
  const { placeholder, searchWord, period, setPeriod, setSearchWord, onSearch, onCancel } = props

  return (
    <div className={styles.container}>
      <div className="w-full flex flex-wrap justify-between gap-[20px]">
        <div className="w-[500px] flex items-center gap-2">
          <StatsSearchBox
            value={searchWord}
            placeholder={placeholder}
            onChange={value => setSearchWord(value)}
            onCancel={onCancel}
          />
        </div>
      </div>
    </div>
  )
}

export default SearchSection
