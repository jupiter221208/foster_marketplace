import React, { useState, useEffect } from 'react'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'

//images
import MerchBadge from 'assets/images/merch-badge.png'
import MerchLock from 'assets/images/merch-lock.png'

// styles
import styles from './index.module.scss'

const MerchBadgeCard = props => {
  const { data } = props
  const [showDialog, setShowDialog] = useState(false)

  return (
    <div className={styles.container}>
      <div className="w-full flex justify-center">
        <img src={MerchBadge.src} alt="" className="w-[159px] h-[159px]" />
      </div>
      <div className={`${styles.title} mt-[8px]`}>{data.title}</div>
      <div className="w-full mt-[30px]">
        <div className="w-full flex justify-between">
          <div className={styles.text}>Add a merch item to your store</div>
          <div className={styles.text}>(1/2)</div>
        </div>
        <div className={`${styles.lineBG} mt-[15px]`}>
          <div className={`w-[50%] ${styles.progressBG}`} />
        </div>
      </div>
      <div className="w-full mt-[30px]">
        <div className="w-full flex justify-between">
          <div className={styles.text}>Add a merch item to an edition listing</div>
          <div className={styles.text}>(0/1)</div>
        </div>
        <div className={`${styles.lineBG} mt-[15px]`}>
          <div className={`w-[0%] ${styles.progressBG}`} />
        </div>
      </div>
      <div className="w-full flex flex-col items-center justify-center mt-[30px]">
        <img src={MerchLock.src} alt="" className="w-[42px] h-[50px] mb-[7px]" />
        <div className={styles.locked}>Locked</div>
      </div>

      <div className="w-full flex flex-col items-center justify-center mt-[30px]">
        <div className={styles.button} onClick={() => setShowDialog(true)}>
          Badge Benefits
        </div>
      </div>
      {showDialog && (
        <div className={styles.dialog}>
          <div className={styles.badgeTitle}>Badge Benefits</div>
          <div className={styles.badgeContent}>
            {`- Access to premium design assets and templates.`}
            <br />
            {`- Featured placement in the "Studio Spotlight" section on Foster Marketplace.`}
            <br />
            {`- Early access to new features and updates on Foster Studio.`}
            <br />
          </div>
          <div className={styles.dlgBottom} onClick={() => setShowDialog(false)}>
            Close
          </div>
        </div>
      )}
    </div>
  )
}

export default MerchBadgeCard
