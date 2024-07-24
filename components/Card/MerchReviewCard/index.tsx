import React, { useState, useEffect } from 'react'
import { useViewport } from 'utils'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'

//images
import merchImageFront from 'assets/images/merch-order-front.png'
import merchImageBack from 'assets/images/merch-order-back.png'
import merchImageLeft from 'assets/images/merch-order-left.png'

// styles
import styles from './index.module.scss'
import ImageWithFoster from 'components/ImageWithFoster'
import RatingBar from 'components/RatingBar'
import { getDateLabel, getLocalDateWithoutTime } from 'utils/helpers'

const MerchReviewCard = props => {
  const { data } = props
  const viewport = useViewport()
  const [isTruncated, setIsTruncated] = useState(true)
  const [tempNftDescription, setTempNftDescription] = useState(data.review)
  let count = viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 220 : 1000
  const processedNftDescription = isTruncated ? tempNftDescription.slice(0, count) : tempNftDescription
  const shouldShowReadMore = tempNftDescription.length > count

  function toggleIsTruncated() {
    setIsTruncated(!isTruncated)
  }

  return (
    <div className={styles.container}>
      <div className={styles.topSection}>
        <div className="flex gap-[15px] sm:gap-[20px] items-center">
          <div className="w-[50px] h-[50px] rounded-full overflow-hidden">
            <ImageWithFoster
              src={
                'https://cdn.helius-rpc.com/cdn-cgi/image/quality=75,width=100/https%3A%2F%2Farweave.net%2FWahgeZMr4XjfqsWupp2p4FMXIz1hfj6QYqBFHP3NGvU'
              }
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className={styles.reviewer}>Reviewer</div>
            <div className={`mt-[8px] ${styles.username}`}>Username</div>
          </div>
        </div>
        <div>
          <div className={`${styles.reviewer} text-end sm:block hidden`}>Overall Rating</div>
          <div className="mt-[0px] sm:mt-[9px]">
            <RatingBar value={data.rating} onRating={() => {}} clickable={false} />
          </div>
        </div>
      </div>
      <div className="w-full px-[15px] sm:px-[27px] py-[23px] block lg:flex gap-[20px]">
        <div>
          <div className="sm:w-[125px] w-full flex justify-center sm:block">
            <div className="w-[125px] h-[125px]">
              <ImageWithFoster src={merchImageFront.src} width={400} className="w-full h-full object-cover" />
            </div>
          </div>
          <div className={`mt-[8px] text-center ${styles.username}`}>product_name</div>
          <div className={`mt-[7px] text-center ${styles.productType}`}>product_type</div>
        </div>
        <div className="flex-1 mt-[25px] sm:mt-[0px]">
          <div className={styles.username}>
            {viewport === 'xs' || viewport === 'sm' || viewport === 'md'
              ? getDateLabel(new Date(data.createdAt))
              : data.headline + ' on ' + getDateLabel(new Date(data.createdAt))}
          </div>
          <div className={`${styles.desc} mt-[12px] sm:mt-[22px]`}>
            {processedNftDescription}
            {shouldShowReadMore && (
              <span onClick={toggleIsTruncated} className={`${styles.greenText} min-w-max cursor-pointer`}>
                {isTruncated ? '... Expand' : ' Collapse'}
              </span>
            )}
          </div>
          <div className="flex justify-end gap-[15px] mt-[20px] sm:mt-[30px]">
            {data.images.map((image, index) => (
              <div key={index} className="w-[53px] h-[53px] rounded-[10px] overflow-hidden">
                <ImageWithFoster src={image} width={100} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MerchReviewCard
