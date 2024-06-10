import React, { useState, useEffect } from 'react'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'

// styles
import styles from './index.module.scss'
import ImageWithFoster from 'components/ImageWithFoster'

const MerchEditionCard = props => {
  const { data, onApplyCard } = props

  return (
    <div className={styles.container}>
      <div className="w-full h-[54px] flex items-center px-[22px]">
        <div className={styles.title}>merch_identifier</div>
      </div>
      <div className={styles.imageArea}>
        <div className={styles.imageContent}>
          <ImageWithFoster
            src={data.image}
            width={500}
            className="max-w-full max-h-full object-cover"
            onClick={() => {}}
          />
        </div>
      </div>
      <div className="w-full px-[13px]">
        <div className={`${styles.content} mt-[11px]`}>Technique: Embroidery</div>
        <div className={`${styles.content} mt-[4px]`}>Placements: Center Chest, Back, Left Sleeve</div>
        <div className={`${styles.content} mt-[4px]`}>Production Cost: $62.49</div>
      </div>
      <div className="w-full mt-[15px] mb-[18px] px-[13px]">
        <div className={styles.button} onClick={() => onApplyCard(data)}>
          Apply
        </div>
      </div>
    </div>
  )
}

export default MerchEditionCard
