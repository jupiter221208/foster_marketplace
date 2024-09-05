import React, { useState } from 'react'
import { useViewport } from 'utils'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'

//images

// styles
import styles from './index.module.scss'
import ImageWithFoster from 'components/ImageWithFoster'
import RatingBar from 'components/RatingBar'
import { getDateLabel } from 'utils/helpers'
import MerchReviewImageModal from 'components/Modal/MerchReviewImageModal'

const MerchReviewCard = props => {
  const { data } = props
  const viewport = useViewport()
  const [showImage, setShowImage] = useState(false)
  const [selectedImage, setSelectedImage] = useState('')
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
      <div className="w-full py-[20px] block sm:hidden">
        <div className="w-full flex gap-[8px]">
          <div className="w-[74px] h-[74px]">
            <ImageWithFoster
              src={data.product_options.addons[0].mockup_url}
              width={200}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className={styles.username}>{data.headline}</div>
            <div className={`mt-[5px] lg:mt-[7px] ${styles.reviewer}`}>{getDateLabel(new Date(data.created_at))}</div>
            <div className="mt-[12px] ml-[-5px]">
              <RatingBar value={data.rating} onRating={() => {}} clickable={true} />
            </div>
          </div>
        </div>
        <div className={`${styles.desc} mt-[25px]`}>
          {processedNftDescription}
          {shouldShowReadMore && (
            <span onClick={toggleIsTruncated} className={`${styles.greenText} min-w-max cursor-pointer`}>
              {isTruncated ? '... Expand' : ' Collapse'}
            </span>
          )}
        </div>
        <div className="w-full flex justify-between mt-[25px]">
          <div>
            <div className={styles.reviewer}>Review by</div>
            <div className={styles.user}>{data.username}</div>
          </div>
          <div className="flex justify-end gap-[15px] ">
            {data.images.map((image, index) => (
              <div
                key={index}
                className="w-[45px] h-[45px] rounded-[10px] overflow-hidden"
                onClick={() => {
                  setSelectedImage(image)
                  setShowImage(true)
                }}
              >
                <ImageWithFoster src={image} width={100} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="w-full py-[23px] hidden sm:flex gap-[12px]">
        <div className="sm:w-[130px] w-full">
          <div className="w-full flex justify-center">
            <div className="w-[130px] h-[130px]">
              <ImageWithFoster
                src={data.product_options.addons[0].mockup_url}
                width={400}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
        <div className="flex-1 mt-[0px] sm:mt-[0px]">
          <div className="w-full flex justify-between">
            <div>
              <div className={styles.username}>{data.headline}</div>
              <div className={`mt-[5px] lg:mt-[7px] ${styles.reviewer}`}>
                {'Review by ' + data.username + ' | ' + getDateLabel(new Date(data.created_at))}
              </div>
              <div className="mt-[0px] sm:mt-[12px] ml-[-5px]">
                <RatingBar value={data.rating} onRating={() => {}} clickable={true} />
              </div>
            </div>

            <div className="hidden sm:flex justify-end gap-[15px] ">
              {data.images.map((image, index) => (
                <div
                  key={index}
                  className="w-[45px] h-[45px] rounded-[10px] overflow-hidden"
                  onClick={() => {
                    setSelectedImage(image)
                    setShowImage(true)
                  }}
                >
                  <ImageWithFoster src={image} width={100} className="max-w-full max-h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
          <div className={`${styles.desc} mt-[15px] sm:mt-[15px]`}>
            {processedNftDescription}
            {shouldShowReadMore && (
              <span onClick={toggleIsTruncated} className={`${styles.greenText} min-w-max cursor-pointer`}>
                {isTruncated ? '... Expand' : ' Collapse'}
              </span>
            )}
          </div>
          <div className="flex sm:hidden justify-start gap-[15px] mt-[15px] sm:mt-[0px] ">
            {data.images.map((image, index) => (
              <div
                key={index}
                className="w-[45px] h-[45px] rounded-[10px] overflow-hidden"
                onClick={() => {
                  setSelectedImage(image)
                  setShowImage(true)
                }}
              >
                <ImageWithFoster src={image} width={100} className="max-w-full max-h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <MerchReviewImageModal open={showImage} image={selectedImage} onClose={() => setShowImage(false)} />
    </div>
  )
}

export default MerchReviewCard
