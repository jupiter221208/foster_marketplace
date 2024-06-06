import React, { useState, useEffect } from 'react'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'

//images
import MerchBadgeUnselectedIcon from 'assets/icons/merch-badge-manlet-unselected.svg?component'
import MerchBadgeSelectedIcon from 'assets/icons/merch-badge-manlet-selected.svg?component'
import MerchStudioUnselectedIcon from 'assets/icons/merch-badge-studio-unselected.svg?component'
import MerchStudioSelectedIcon from 'assets/icons/merch-badge-studio-selected.svg?component'
import MerchFashionUnselectedIcon from 'assets/icons/merch-badge-fashion-unselected.svg?component'
import MerchFashionSelectedIcon from 'assets/icons/merch-badge-fashion-selected.svg?component'
import MerchArrowIcon from 'assets/icons/arrow-three-up.svg?component'
import ViweBageIconSelected from 'assets/icons/view-badge-icon-selected.svg?component'
import ViweBageIconUnselected from 'assets/icons/view-badge-icon-unselected.svg?component'

// styles
import styles from './index.module.scss'

const MerchBadgeCard = props => {
  const { data, onSelect } = props
  const [showDialog, setShowDialog] = useState(false)

  return (
    <div className={styles.container} onClick={() => onSelect(data.id)}>
      <div className="w-full px-[21px]">
        <div className="w-full flex justify-center">
          {data.type === 'merch' ? (
            <div className="w-[75px] h-[75px]">
              {data.selected ? <MerchBadgeSelectedIcon /> : <MerchBadgeUnselectedIcon />}
            </div>
          ) : data.type === 'studio' ? (
            <div className="w-[75px] h-[75px]">
              {data.selected ? <MerchStudioSelectedIcon /> : <MerchStudioUnselectedIcon />}
            </div>
          ) : (
            <div className="w-[75px] h-[75px]">
              {data.selected ? <MerchFashionSelectedIcon /> : <MerchFashionUnselectedIcon />}
            </div>
          )}
        </div>
        <div className={`${data.selected ? styles.greenTitle : styles.grayTitle} mt-[15px]`}>{data.title}</div>
        {data.list.map((item, index) => (
          <div key={index} className="w-full mt-[30px]">
            <div className="w-full flex justify-between">
              <div className={styles.text}>{item.label}</div>
              <div className={styles.text}>
                ({item.value}/{item.total})
              </div>
            </div>
            <div className={`${styles.lineBG} mt-[15px]`}>
              <div className={`w-[${(item.value / item.total) * 100}%] ${styles.progressBG}`} />
            </div>
          </div>
        ))}
      </div>
      <div className={styles.bottomSection} onClick={() => setShowDialog(true)}>
        <MerchArrowIcon />
        <div>
          <div className="w-full flex justify-center">
            {data.selected ? <ViweBageIconSelected /> : <ViweBageIconUnselected />}
          </div>
          <div className={styles.buttonText}>View Badge Benefits</div>
        </div>
        <MerchArrowIcon />
      </div>
      {showDialog && (
        <div className={styles.dialog}>
          <div className={styles.badgeTitle}>Badge Benefits</div>
          {data.type === 'merch' ? (
            <div className={styles.badgeContent}>
              <p>- Personalized marketing support, including social media features and artist spotlights.</p>
              <p>- Featured placement in the "Studio Spotlight" section on Foster Marketplace.</p>
              <p>- Personalized thank you notes included with each order.</p>
            </div>
          ) : data.type === 'studio' ? (
            <div className={styles.badgeContent}>
              <p>- Apparel added to IRL events sponsored by Foster Studio.</p>
              <p>- Priority shipping on merch orders.</p>
              <p>- Receive free samples of new merch products before they are available to others.</p>
              <p>- Enhanced options for customizing the look and feel of your merch store.</p>
            </div>
          ) : (
            <div className={styles.badgeContent}>
              <p>- Custom packaging</p>
              <p>- Custom Neck Label Tags</p>
              <p>- Invitations to exclusive networking events with other top creators.</p>
              <p>- Reduced fees for transactions on the platform.</p>
              <p>- Participation in platform governance and treasury spending</p>
            </div>
          )}
          <div className={styles.dlgBottom} onClick={() => setShowDialog(false)}>
            Close
          </div>
        </div>
      )}
    </div>
  )
}

export default MerchBadgeCard
