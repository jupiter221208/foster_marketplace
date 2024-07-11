import React, { useState, useEffect } from 'react'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'

//images
import PloygonBG from 'assets/icons/polygon-bg.svg?component'
import PloygonMobileBG from 'assets/icons/polygon-mobile-bg.svg?component'

import PloygonSmallBG from 'assets/icons/polygon-small-bg.svg?component'
import PloygonSmallMobileBG from 'assets/icons/polygon-small-bg-mobile.svg?component'
import DiamondEnable from 'assets/icons/diamond-enable.svg?component'
import DiamondDisable from 'assets/icons/diamond-disable.svg?component'

// styles
import styles from './index.module.scss'
import MerchBadgeModal from 'components/Modal/MerchBadgeModal'

const MerchBadgeNewCard = props => {
  const { data, onSelect } = props
  const [showDialog, setShowDialog] = useState(false)

  return (
    <div className={styles.container} onClick={() => onSelect(data.id)}>
      <div className="lg:block hidden">
        <PloygonBG />
      </div>
      <div className="lg:hidden block">
        <PloygonMobileBG />
      </div>
      <div className="absolute inset-0">
        <div className="mt-[20px] lg:mt-[39px] w-full flex justify-center">
          <div className="relative w-[46px] lg:w-[56px] h-[50px] lg:h-[60px]">
            <div className="lg:block hidden">
              <PloygonSmallBG />
            </div>
            <div className="lg:hidden block">
              <PloygonSmallMobileBG />
            </div>
            <div className="absolute inset-0 flex justify-center items-center">
              {data.locked ? <DiamondDisable /> : <DiamondEnable />}
            </div>
          </div>
        </div>
        <div className="mt-[9px] lg:mt-[39px] w-full flex justify-center">
          <div className={styles.title}>{data.title}</div>
        </div>
        <div className="lg:flex hidden mt-[9px] w-full justify-center">
          {data.locked ? (
            <div className={styles.description}>{data.description}</div>
          ) : (
            <div className={styles.unlocked}>Unlocked</div>
          )}
        </div>
        <div className="mt-[9px] lg:mt-[78px] w-full flex justify-center">
          <div className={styles.perks} onClick={() => setShowDialog(true)}>{`Badge Perks »`}</div>
        </div>
      </div>
      {showDialog && <MerchBadgeModal data={data} open={showDialog} onClose={() => setShowDialog(false)} />}
    </div>
  )
}

export default MerchBadgeNewCard
