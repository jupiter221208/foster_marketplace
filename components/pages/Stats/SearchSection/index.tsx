import React, { useEffect, useState } from 'react'

// components
import StatsSearchBox from 'components/Input/StatsSearchBox'
import GradientButton from 'components/Button/GradientButton'

// resources
import SearchLargeIcon from 'assets/icons/search-large.svg'
import SearchLargeDarkIcon from 'assets/icons/search-large-dark.svg'

import SearchLargeEnableIcon from 'assets/icons/search-large-enable.svg'

// styles
import styles from './index.module.scss'
import Image from 'next/image'
import { useSelector } from 'react-redux'

const SearchSection = props => {
  const { searchWord, period, setPeriod, setSearchWord, onSearch } = props
  const lightMode = useSelector(state => (state as any).lightMode)

  return (
    <div className={styles.container}>
      <div className="w-full flex flex-wrap justify-between gap-[20px]">
        <div className="w-[500px] flex items-center gap-2">
          <StatsSearchBox
            value={searchWord}
            placeholder="Search by artwork name"
            onChange={value => setSearchWord(value)}
          />
          <div className="w-[50px] h-[50px] flex justify-center items-center" onClick={() => onSearch()}>
            <Image
              className="w-full h-full"
              width={50}
              height={50}
              src={searchWord?.length > 0 ? SearchLargeEnableIcon : lightMode ? SearchLargeIcon : SearchLargeDarkIcon}
              alt="search"
            />
          </div>
        </div>

        <div className="sm:w-auto xs:w-full flex justify-between gap-[10px] lg:gap-[30px] xl:gap-[50px]">
          <GradientButton
            label="24 hrs"
            onClick={() => setPeriod('day')}
            color={period === 'day' ? (lightMode ? '#95DBD5' : '#202427') : '#979EA2'}
            backgroundColor01={period === 'day' ? (lightMode ? '#202427' : '#5ac3ba') : 'transparent'}
            backgroundColor02={period === 'day' ? (lightMode ? '#202427' : '#2D625D') : 'transparent'}
            gradientDirection="bottom"
          />
          <GradientButton
            label="7 days"
            onClick={() => setPeriod('week')}
            color={period === 'week' ? (lightMode ? '#95DBD5' : '#202427') : '#979EA2'}
            backgroundColor01={period === 'week' ? (lightMode ? '#202427' : '#5ac3ba') : 'transparent'}
            backgroundColor02={period === 'week' ? (lightMode ? '#202427' : '#2D625D') : 'transparent'}
            gradientDirection="bottom"
          />
          <GradientButton
            label="30 days"
            onClick={() => setPeriod('month')}
            color={period === 'month' ? (lightMode ? '#95DBD5' : '#202427') : '#979EA2'}
            backgroundColor01={period === 'month' ? (lightMode ? '#202427' : '#5ac3ba') : 'transparent'}
            backgroundColor02={period === 'month' ? (lightMode ? '#202427' : '#2D625D') : 'transparent'}
            gradientDirection="bottom"
          />
          <GradientButton
            label="All Time"
            onClick={() => setPeriod('all')}
            color={period === 'all' ? (lightMode ? '#95DBD5' : '#202427') : '#979EA2'}
            backgroundColor01={period === 'all' ? (lightMode ? '#202427' : '#5ac3ba') : 'transparent'}
            backgroundColor02={period === 'all' ? (lightMode ? '#202427' : '#2D625D') : 'transparent'}
            gradientDirection="bottom"
          />
        </div>
      </div>
    </div>
  )
}

export default SearchSection
