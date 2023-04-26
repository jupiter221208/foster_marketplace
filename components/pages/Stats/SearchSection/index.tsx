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
import TimeSlotButton from 'components/Button/TimeSlotButton'

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
          <div className="w-[50px] h-[50px] flex justify-center items-center" onClick={() => onSearch()}>
            {searchWord?.length > 0 ? (
              <svg
                id="Component_2335_3"
                data-name="Component 2335 – 3"
                xmlns="http://www.w3.org/2000/svg"
                width="50"
                height="50"
                viewBox="0 0 50 50"
              >
                <defs>
                  <linearGradient id="linear-gradient" x1="0.5" x2="0.5" y2="1" gradientUnits="objectBoundingBox">
                    <stop offset="0" stopColor="var(--search-icon-stop-1)" />
                    <stop offset="1" stopColor="var(--search-icon-stop-2)" />
                  </linearGradient>
                </defs>
                <g id="Path_108407" data-name="Path 108407" fill="url(#linear-gradient)">
                  <path
                    d="M 40 49.5 L 10 49.5 C 4.761680126190186 49.5 0.5 45.23831939697266 0.5 40 L 0.5 10 C 0.5 4.761680126190186 4.761680126190186 0.5 10 0.5 L 40 0.5 C 45.23831939697266 0.5 49.5 4.761680126190186 49.5 10 L 49.5 40 C 49.5 45.23831939697266 45.23831939697266 49.5 40 49.5 Z"
                    stroke="none"
                  />
                  <path
                    d="M 10 1 C 5.037380218505859 1 1 5.037380218505859 1 10 L 1 40 C 1 44.96261978149414 5.037380218505859 49 10 49 L 40 49 C 44.96261978149414 49 49 44.96261978149414 49 40 L 49 10 C 49 5.037380218505859 44.96261978149414 1 40 1 L 10 1 M 10 0 L 40 0 C 45.52285003662109 0 50 4.477149963378906 50 10 L 50 40 C 50 45.52285003662109 45.52285003662109 50 40 50 L 10 50 C 4.477149963378906 50 0 45.52285003662109 0 40 L 0 10 C 0 4.477149963378906 4.477149963378906 0 10 0 Z"
                    stroke="none"
                    fill="var(--checkbox-bg-color)"
                  />
                </g>
                <path
                  id="search-32"
                  d="M21.71,20.29,18,16.61A9,9,0,1,0,16.61,18l3.68,3.68a.994.994,0,1,0,1.42-1.39ZM11,18a7,7,0,1,1,7-7,7,7,0,0,1-7,7Z"
                  transform="translate(13.015 13.022)"
                  fill="var(--main-icon-color)"
                />
              </svg>
            ) : (
              <svg
                id="Component_2335_3"
                data-name="Component 2335 – 3"
                xmlns="http://www.w3.org/2000/svg"
                width="50"
                height="50"
                viewBox="0 0 50 50"
              >
                <g
                  id="Rectangle_21247"
                  data-name="Rectangle 21247"
                  fill="var(--stats-search-bg)"
                  stroke="var(--search-icon-bg)"
                  strokeWidth="1"
                >
                  <rect width="50" height="50" rx="10" stroke="none" />
                  <rect x="0.5" y="0.5" width="49" height="49" rx="9.5" fill="none" />
                </g>
                <path
                  id="search-32"
                  d="M21.71,20.29,18,16.61A9,9,0,1,0,16.61,18l3.68,3.68a.994.994,0,1,0,1.42-1.39ZM11,18a7,7,0,1,1,7-7,7,7,0,0,1-7,7Z"
                  transform="translate(13.015 13.022)"
                  fill="var(--search-gray-icon-disable)"
                />
              </svg>
            )}
          </div>
        </div>

        <div className="sm:w-auto xs:w-full flex justify-between gap-[10px] lg:gap-[30px] xl:gap-[50px]">
          <TimeSlotButton
            label="24 hrs"
            onClick={() => setPeriod('day')}
            fontFamily={period === 'day' ? 'Muli-Bold' : 'Muli-SemiBold'}
            color={period === 'day' ? 'var(--day-btn-color)' : '#979EA2'}
            backgroundColor01={period === 'day' ? 'var(--day-btn-bg-1)' : 'transparent'}
            backgroundColor02={period === 'day' ? 'var(--day-btn-bg-2)' : 'transparent'}
            gradientDirection="bottom"
          />
          <TimeSlotButton
            label="7 days"
            onClick={() => setPeriod('week')}
            fontFamily={period === 'week' ? 'Muli-Bold' : 'Muli-SemiBold'}
            color={period === 'week' ? 'var(--day-btn-color)' : '#979EA2'}
            backgroundColor01={period === 'week' ? 'var(--day-btn-bg-1)' : 'transparent'}
            backgroundColor02={period === 'week' ? 'var(--day-btn-bg-2)' : 'transparent'}
            gradientDirection="bottom"
          />
          <TimeSlotButton
            label="30 days"
            onClick={() => setPeriod('month')}
            fontFamily={period === 'month' ? 'Muli-Bold' : 'Muli-SemiBold'}
            color={period === 'month' ? 'var(--day-btn-color)' : '#979EA2'}
            backgroundColor01={period === 'month' ? 'var(--day-btn-bg-1)' : 'transparent'}
            backgroundColor02={period === 'month' ? 'var(--day-btn-bg-2)' : 'transparent'}
            gradientDirection="bottom"
          />
          <TimeSlotButton
            label="All Time"
            onClick={() => setPeriod('all')}
            fontFamily={period === 'all' ? 'Muli-Bold' : 'Muli-SemiBold'}
            color={period === 'all' ? 'var(--day-btn-color)' : '#979EA2'}
            backgroundColor01={period === 'all' ? 'var(--day-btn-bg-1)' : 'transparent'}
            backgroundColor02={period === 'all' ? 'var(--day-btn-bg-2)' : 'transparent'}
            gradientDirection="bottom"
          />
        </div>
      </div>
    </div>
  )
}

export default SearchSection
