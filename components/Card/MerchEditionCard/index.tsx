import React, { useState, useEffect } from 'react'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'

// styles
import styles from './index.module.scss'
import ImageWithFoster from 'components/ImageWithFoster'

const MerchEditionCard = props => {
  const { data, onApplyCard } = props

  const getTechnique = () => {
    return data.description?.split(' | ')[2]
  }

  const getColor = () => {
    return data.description?.split(' | ')[3]
  }
  return (
    <div className={styles.container}>
      <div className="w-full h-[54px] flex items-center px-[22px]">
        <div className={styles.title}>{data.name}</div>
      </div>
      <div className={styles.imageArea}>
        <div className={styles.imageContent}>
          <ImageWithFoster
            src={data.options.product_images[0]}
            width={500}
            className="max-w-full max-h-full object-cover"
            onClick={() => {}}
          />
        </div>
      </div>
      <div className="w-full px-[13px]">
        <div className={`${styles.content} mt-[11px]`}>Technique: {getTechnique()}</div>
        <div className={`${styles.content} mt-[4px]`}>Color: {getColor()}</div>
        <div className={`${styles.content} mt-[4px]`}>Production Cost: ${data.selling_price / 100}</div>
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
