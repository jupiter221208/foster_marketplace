import React, { useState } from 'react'

// components
import StatsSearchBox from 'components/Input/StatsSearchBox'

// resources

// styles
import styles from './index.module.scss'
import TimeSlotButton from 'components/Button/TimeSlotButton'

const CreatorSearchSection = props => {
  const { placeholder, searchWord, setSearchWord, onFilter } = props
  const [active, setActive] = useState<any>(0)
  const handleChangeActive = value => {
    setActive(value)
    onFilter(value)
  }
  return (
    <div className={styles.container}>
      <div className="w-full flex flex-wrap justify-between gap-[20px] items-center">
        <div className="w-[500px] flex items-center gap-2 justify-between">
          <StatsSearchBox value={searchWord} placeholder={placeholder} onChange={value => setSearchWord(value)} />
        </div>
        <div className="h-[54px] z-10">
          <div className={styles.slotBG}>
            <TimeSlotButton
              label="Completed"
              onClick={() => handleChangeActive(0)}
              fontFamily={'Muli-SemiBold'}
              color={active === 0 ? '#1A1A1A' : '#979EA2'}
              backgroundColor01={active === 0 ? 'var(--toggle-bg-color)' : 'transparent'}
              backgroundColor02={active === 0 ? 'var(--toggle-bg-color)' : 'transparent'}
              gradientDirection="bottom"
              width={100}
              boxShadow={active === 0 ? '0px 0px 10px rgba(32, 36, 39, 0.15)' : ''}
            />
            <TimeSlotButton
              label="Pending"
              onClick={() => handleChangeActive(1)}
              fontFamily={'Muli-SemiBold'}
              color={active === 1 ? '#1A1A1A' : '#979EA2'}
              backgroundColor01={active === 1 ? 'var(--toggle-bg-color)' : 'transparent'}
              backgroundColor02={active === 1 ? 'var(--toggle-bg-color)' : 'transparent'}
              gradientDirection="bottom"
              width={100}
              boxShadow={active === 1 ? '0px 0px 10px rgba(32, 36, 39, 0.15)' : ''}
            />
            <TimeSlotButton
              label="All"
              onClick={() => handleChangeActive(2)}
              fontFamily={'Muli-SemiBold'}
              color={active === 2 ? '#1A1A1A' : '#979EA2'}
              backgroundColor01={active === 2 ? 'var(--toggle-bg-color)' : 'transparent'}
              backgroundColor02={active === 2 ? 'var(--toggle-bg-color)' : 'transparent'}
              gradientDirection="bottom"
              width={80}
              boxShadow={active === 2 ? '0px 0px 10px rgba(32, 36, 39, 0.15)' : ''}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreatorSearchSection
