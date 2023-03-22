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
import IconButtonWithSVG from 'components/Button/IconButtonWithSVG'

const MobileSort = props => {
  const { data, sort, onSort, onClose } = props
  const [selectedSort, setSelectedSort] = useState(sort)

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className="w-full flex justify-between items-center mb-8">
          <div className={styles.title}>Sort</div>
          <div className="-mr-3">
            {/* <IconButton
              backgroundColor="transparent"
              icon={lightMode ? CloseWhiteLightIcon : CloseWhiteIcon}
              onClick={() => onClose()}
            /> */}
            <IconButtonWithSVG
              backgroundColor="transparent"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" width="17.323" height="17.321" viewBox="0 0 17.323 17.321">
                  <path
                    id="times-7"
                    d="M16.689,14.655l6.2-6.187A1.448,1.448,0,1,0,20.843,6.42l-6.187,6.2L8.469,6.42A1.448,1.448,0,0,0,6.421,8.468l6.2,6.187-6.2,6.187A1.448,1.448,0,1,0,8.469,22.89l6.187-6.2,6.187,6.2a1.448,1.448,0,1,0,2.048-2.048Z"
                    transform="translate(-5.994 -5.996)"
                    fill="var(--filter-close-color)"
                  />
                </svg>
              }
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
