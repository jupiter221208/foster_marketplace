import React from 'react'

// components
import ImageWithFoster from 'components/ImageWithFoster'

// resources
import MerchOpenIcon from 'assets/icons/merch-open-icon.svg?component'

// styles
import styles from './index.module.scss'

const NFTEditionMerchCard = props => {
  const { url, name, setFullScreenMerch } = props

  return (
    <div className={styles.merchArea} onClick={() => setFullScreenMerch(true)}>
      <div className="w-full flex flex-1 gap-[10px] lg:gap-[15px] mt-[18px] pl-[10px] sm:pl-[12px] md:pl-[16px]">
        <div className={styles.assetArea}>
          <ImageWithFoster width={65} src={url} />
        </div>
        <div className={styles.contentArea}>
          <div className="w-full flex justify-between items-center">
            <div className={styles.merchTitle}>Merch included with each edition</div>
            <div className="mr-[13px] mt-[-6px] lg:mt-[-7px]">
              <MerchOpenIcon />
            </div>
          </div>
          <div className={styles.merchContent}>{name}</div>
        </div>
      </div>
    </div>
  )
}

export default NFTEditionMerchCard
