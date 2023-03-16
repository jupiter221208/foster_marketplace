import React, { useState } from 'react'

// components
import IconButton from 'components/Button/IconButton'
import Radio from 'components/Radio'
import OutlineButton from 'components/Button/OutlineButton'
import GradientButton from 'components/Button/GradientButton'

// images and icons
import CloseWhiteIcon from 'assets/icons/close-white.svg'
import CloseWhiteLightIcon from 'assets/icons/close-white-light.svg'

// json
import NFTSortList from 'assets/json/explore/nft-sort.json'

// styles
import styles from './index.module.scss'
import { useSelector } from 'react-redux'

const MobileSort = props => {
  const { data, sort, onSort, onClose } = props
  const [selectedSort, setSelectedSort] = useState(sort)
  const lightMode = useSelector(state => (state as any).lightMode)

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className="w-full flex justify-between items-center mb-8">
          <div className={styles.title}>Sort</div>
          <div className="-mr-3">
            <IconButton
              backgroundColor="transparent"
              icon={lightMode ? CloseWhiteLightIcon : CloseWhiteIcon}
              onClick={() => onClose()}
            />
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
          <GradientButton
            label="Done"
            onClick={() => {
              onSort({
                sort: selectedSort,
              })
            }}
            color="#202427"
            fullWidth
          />
        </div>
      </div>
    </div>
  )
}

export default MobileSort
