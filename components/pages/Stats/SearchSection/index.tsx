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
      <div className="w-full flex flex-wrap justify-start lg:justify-end gap-[20px]">
        <div className="h-[42px] flex justify-between gap-[10px] lg:gap-[15px]">
          <TimeSlotButton
            label="All"
            onClick={() => setPeriod('all')}
            fontFamily={'Muli-SemiBold'}
            selected={period === 'all'}
          />
          <TimeSlotButton
            label="24 hrs"
            onClick={() => setPeriod('day')}
            fontFamily={'Muli-SemiBold'}
            selected={period === 'day'}
          />
          <TimeSlotButton
            label="7 days"
            onClick={() => setPeriod('week')}
            fontFamily={'Muli-SemiBold'}
            selected={period === 'week'}
          />
          <TimeSlotButton
            label="30 days"
            onClick={() => setPeriod('month')}
            fontFamily={'Muli-SemiBold'}
            selected={period === 'month'}
          />
        </div>
      </div>
    </div>
  )
}

export default SearchSection
