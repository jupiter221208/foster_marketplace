import React, { useEffect, useState } from 'react'

// components
import StatsSearchBox from 'components/Input/StatsSearchBox'
import GradientButton from 'components/Button/GradientButton'

// styles
import styles from './index.module.scss'

const SearchSection = props => {
  const { searchWord, period, setPeriod, setSearchWord, onSearch } = props

  return (
    <div className={styles.container}>
      <div className="w-full flex flex-wrap justify-between gap-[20px]">
        <div className="w-[500px] flex items-center gap-2">
          <StatsSearchBox
            value={searchWord}
            placeholder="Search by artwork name"
            onChange={value => setSearchWord(value)}
          />
          <GradientButton label="Search" height="45px" onClick={() => onSearch()} />
        </div>

        <div className="sm:w-auto xs:w-full flex justify-between gap-[10px] lg:gap-[30px] xl:gap-[50px]">
          <GradientButton
            label="24 hrs"
            onClick={() => setPeriod('day')}
            color={period === 'day' ? '#202427' : '#979EA2'}
            backgroundColor01={period === 'day' ? '#5ac3ba' : 'transparent'}
            backgroundColor02={period === 'day' ? '#2D625D' : 'transparent'}
            gradientDirection="bottom"
          />
          <GradientButton
            label="7 days"
            onClick={() => setPeriod('week')}
            color={period === 'week' ? '#202427' : '#979EA2'}
            backgroundColor01={period === 'week' ? '#5ac3ba' : 'transparent'}
            backgroundColor02={period === 'week' ? '#2D625D' : 'transparent'}
            gradientDirection="bottom"
          />
          <GradientButton
            label="30 days"
            onClick={() => setPeriod('month')}
            color={period === 'month' ? '#202427' : '#979EA2'}
            backgroundColor01={period === 'month' ? '#5ac3ba' : 'transparent'}
            backgroundColor02={period === 'month' ? '#2D625D' : 'transparent'}
            gradientDirection="bottom"
          />
          <GradientButton
            label="All Time"
            onClick={() => setPeriod('all')}
            color={period === 'all' ? '#202427' : '#979EA2'}
            backgroundColor01={period === 'all' ? '#5ac3ba' : 'transparent'}
            backgroundColor02={period === 'all' ? '#2D625D' : 'transparent'}
            gradientDirection="bottom"
          />
        </div>
      </div>
    </div>
  )
}

export default SearchSection
