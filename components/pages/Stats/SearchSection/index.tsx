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
        <div className="h-[42px] flex justify-between gap-[15px]">
          <TimeSlotButton
            label="All"
            onClick={() => setPeriod('all')}
            fontFamily={'Muli-SemiBold'}
            color={period === 'all' ? '#1A1A1A' : '#979EA2'}
            backgroundColor01={period === 'all' ? 'var(--toggle-bg-color)' : 'rgba(var(--main-bg-color-rgb), 0.05)'}
            backgroundColor02={period === 'all' ? 'var(--toggle-bg-color)' : 'rgba(var(--main-bg-color-rgb), 0.05)'}
            gradientDirection="bottom"
          />
          <TimeSlotButton
            label="24 hrs"
            onClick={() => setPeriod('day')}
            fontFamily={'Muli-SemiBold'}
            color={period === 'day' ? '#1A1A1A' : '#979EA2'}
            backgroundColor01={period === 'day' ? 'var(--toggle-bg-color)' : 'rgba(var(--main-bg-color-rgb), 0.05)'}
            backgroundColor02={period === 'day' ? 'var(--toggle-bg-color)' : 'rgba(var(--main-bg-color-rgb), 0.05)'}
            gradientDirection="bottom"
          />
          <TimeSlotButton
            label="7 days"
            onClick={() => setPeriod('week')}
            fontFamily={'Muli-SemiBold'}
            color={period === 'week' ? '#1A1A1A' : '#979EA2'}
            backgroundColor01={period === 'week' ? 'var(--toggle-bg-color)' : 'rgba(var(--main-bg-color-rgb), 0.05)'}
            backgroundColor02={period === 'week' ? 'var(--toggle-bg-color)' : 'rgba(var(--main-bg-color-rgb), 0.05)'}
            gradientDirection="bottom"
          />
          <TimeSlotButton
            label="30 days"
            onClick={() => setPeriod('month')}
            fontFamily={'Muli-SemiBold'}
            color={period === 'month' ? '#1A1A1A' : '#979EA2'}
            backgroundColor01={period === 'month' ? 'var(--toggle-bg-color)' : 'rgba(var(--main-bg-color-rgb), 0.05)'}
            backgroundColor02={period === 'month' ? 'var(--toggle-bg-color)' : 'rgba(var(--main-bg-color-rgb), 0.05)'}
            gradientDirection="bottom"
          />
        </div>
      </div>
    </div>
  )
}

export default SearchSection
