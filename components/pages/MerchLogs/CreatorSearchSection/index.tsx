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
        <div className="h-[50px] z-10">
          <div className={styles.slotBG}>
            <TimeSlotButton
              label="Completed"
              onClick={() => handleChangeActive(0)}
              selected={active === 0}
              width={100}
            />
            <TimeSlotButton label="Pending" onClick={() => handleChangeActive(1)} selected={active === 1} width={100} />
            <TimeSlotButton
              label="All"
              onClick={() => handleChangeActive(2)}
              fontFamily={'Muli-SemiBold'}
              selected={active === 2}
              width={80}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreatorSearchSection
