import React, { useState, useEffect } from 'react'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'

//images
import PloygonBG from 'assets/icons/polygon-bg.svg?component'
import PloygonSmallBG from 'assets/icons/polygon-small-bg.svg?component'
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
      <PloygonBG />
      <div className="absolute inset-0">
        <div className="mt-[39px] w-full flex justify-center">
          <div className="relative w-[56px] h-[60px]">
            <PloygonSmallBG />
            <div className="absolute inset-0 flex justify-center items-center">
              {data.locked ? <DiamondDisable /> : <DiamondEnable />}
            </div>
          </div>
        </div>
        <div className="mt-[39px] w-full flex justify-center">
          <div className={styles.title}>{data.title}</div>
        </div>
        <div className="mt-[9px] w-full flex justify-center">
          {data.locked ? (
            <div className={styles.description}>{data.description}</div>
          ) : (
            <div className={styles.unlocked}>Unlocked</div>
          )}
        </div>
        <div className="mt-[78px] w-full flex justify-center">
          <div className={styles.perks} onClick={() => setShowDialog(true)}>{`Badge Perks »`}</div>
        </div>
      </div>
      {showDialog && <MerchBadgeModal data={data} open={showDialog} onClose={() => setShowDialog(false)} />}
    </div>
  )
}

export default MerchBadgeNewCard
