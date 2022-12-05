import React, { useState } from 'react'

// components
import IconButton from 'components/Button/IconButton'
import Radio from 'components/Radio'
import OutlineButton from 'components/Button/OutlineButton'
import GradientButton from 'components/Button/GradientButton'

// images and icons
import CloseWhiteIcon from 'assets/icons/close-white.svg'

// json
import ProfileList from 'assets/json/explore/profile.json'

// styles
import styles from './index.module.scss'

const MobileSort = props => {
  const { data, onClose } = props
  const [selectedSort, setSelectedSort] = useState(ProfileList[0])

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className="w-full flex justify-between items-center mb-8">
          <div className={styles.title}>Sort</div>
          <div className="-mr-3">
            <IconButton icon={CloseWhiteIcon} onClick={() => onClose()} />
          </div>
        </div>
        <Radio data={data} selected={selectedSort} onChange={item => setSelectedSort(item)} direction="rtl" />
      </div>
      <div className={styles.bottomArea}>
        <div className="w-[94px]">
          <OutlineButton
            label="Cancel"
            onClick={() => onClose()}
            color="#EFF0F6"
            borderWidth={2}
            borderColor="#5AC3BA"
            fullWidth
          />
        </div>
        <div className="w-[94px]">
          <GradientButton label="Done" onClick={() => onClose()} color="#202427" fullWidth />
        </div>
      </div>
    </div>
  )
}

export default MobileSort
