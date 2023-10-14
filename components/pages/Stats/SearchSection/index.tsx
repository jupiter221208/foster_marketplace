import React from 'react'

// components
import StatsSearchBox from 'components/Input/StatsSearchBox'

// resources

// styles
import styles from './index.module.scss'
import TimeSlotButton from 'components/Button/TimeSlotButton'

const SearchSection = props => {
  const { placeholder, searchWord, period, setPeriod, setSearchWord, onSearch, onCancel } = props

  return (
    <div className={styles.container}>
      <div className="w-full flex flex-wrap justify-end gap-[20px]">
        <div className="w-full h-[54px] flex lg:w-[400px] justify-between gap-[10px]">
          <div className={styles.slotBG}>
            <TimeSlotButton
              label="24 hrs"
              onClick={() => setPeriod('day')}
              fontFamily={'Muli-SemiBold'}
              color={period === 'day' ? 'var(--search-menu-icon-color)' : '#979EA2'}
              backgroundColor01={period === 'day' ? 'var(--time-slog-bg)' : 'transparent'}
              backgroundColor02={period === 'day' ? 'var(--time-slog-bg)' : 'transparent'}
              gradientDirection="bottom"
            />
            <TimeSlotButton
              label="7 days"
              onClick={() => setPeriod('week')}
              fontFamily={'Muli-SemiBold'}
              color={period === 'week' ? 'var(--search-menu-icon-color)' : '#979EA2'}
              backgroundColor01={period === 'week' ? 'var(--time-slog-bg)' : 'transparent'}
              backgroundColor02={period === 'week' ? 'var(--time-slog-bg)' : 'transparent'}
              gradientDirection="bottom"
            />
            <TimeSlotButton
              label="30 days"
              onClick={() => setPeriod('month')}
              fontFamily={'Muli-SemiBold'}
              color={period === 'month' ? 'var(--search-menu-icon-color)' : '#979EA2'}
              backgroundColor01={period === 'month' ? 'var(--time-slog-bg)' : 'transparent'}
              backgroundColor02={period === 'month' ? 'var(--time-slog-bg)' : 'transparent'}
              gradientDirection="bottom"
            />
            <TimeSlotButton
              label="All Time"
              onClick={() => setPeriod('all')}
              fontFamily={'Muli-SemiBold'}
              color={period === 'all' ? 'var(--search-menu-icon-color)' : '#979EA2'}
              backgroundColor01={period === 'all' ? 'var(--time-slog-bg)' : 'transparent'}
              backgroundColor02={period === 'all' ? 'var(--time-slog-bg)' : 'transparent'}
              gradientDirection="bottom"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default SearchSection
