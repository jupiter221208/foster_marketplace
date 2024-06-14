import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import { getOrder, OrderData } from 'apis/merch'
import { findElement } from 'utils/helpers'

// styles
import styles from './index.module.scss'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'

// component
import MerchStepper from 'components/MerchStepper'
import PrimaryLayout from 'components/Layout/PrimaryLayout'
import ShoppingCartPhysicalCheckout from 'components/pages/BrowseNFT/MerchSection/ShoppingCartPhysicalCheckout'

import { Swiper, SwiperSlide } from 'swiper/react'
import { NextButton, PreviewButton } from 'components/pages/Studio/MainSection/customButton'
import ImageWithFoster from 'components/ImageWithFoster'

const OrderSection = props => {
  const router = useRouter()
  const dispatch = useDispatch()
  const { id } = router.query

  const [orderData, setOrderData] = useState<OrderData | null>(null)
  const [merchType, setMerchType] = useState('')
  const [swiper, setSwiper] = useState(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [data, setData] = useState(null)

  const goNext = () => {
    if (swiper !== null) swiper.slideNext()
    setCurrentStep(swiper.activeIndex)
  }

  const goPrev = () => {
    if (swiper !== null) swiper.slidePrev()
    setCurrentStep(swiper.activeIndex)
  }

  const handleOnChange = () => {
    setCurrentStep(swiper.activeIndex)
  }

  useEffect(() => {
    if (typeof id != 'string' || !Number.isFinite(parseInt(id))) return
    getOrder(id).then(setOrderData)
  }, [id])

  useEffect(() => {
    if (orderData) {
      let imageArray = []
      orderData.ssorder.items.forEach(itemData => {
        let type = findElement(itemData.options, 'name', 'type').value
        setMerchType(type)
        let previewUrl = itemData.imageUrl
        let coverUrl = findElement(itemData.options, 'name', 'assetUrl').value
        imageArray.push({ previewUrl, coverUrl })
      })
      setData(imageArray)
    }
  }, [orderData])

  return (
    <div className="g-container">
      <div className={styles.container}>
        <div className="w-full grid grid-cols-2 gap-10 mt-[20px] lg:mt-[0px]">
          <div className="col-span-2 lg:col-span-1">
            {merchType === 'apparel' && data && (
              <Swiper
                slidesPerView={1}
                spaceBetween={0}
                pagination={{
                  clickable: true,
                }}
                onSlideChange={handleOnChange}
                onSwiper={setSwiper}
              >
                {data && data.length > 1 && (
                  <div className="mt-[25px]">
                    <div className={styles.orderTitle}>
                      {currentStep + 1}/{orderData?.ssorder.items.length} cart items included in order
                    </div>
                    <div className={styles.prevButton} onClick={goPrev}>
                      <PreviewButton />
                    </div>
                    <div className={styles.nextButton} onClick={goNext}>
                      <NextButton />
                    </div>
                  </div>
                )}
                {data &&
                  data?.map((item, index) => (
                    <SwiperSlide key={index}>
                      <div className={styles.blurBackground}>
                        <div className="w-full h-full lg:w-[700px] lg:h-[700px] mb-[20px]">
                          <ImageWithFoster width={700} src={item?.previewUrl} className="w-full h-full object-cover" />
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
              </Swiper>
            )}
          </div>
          <div className="col-span-2 lg:col-span-1 z-10">
            <div className={styles.contentContainer}>
              {orderData && (
                <ShoppingCartPhysicalCheckout
                  orderData={orderData}
                  type="apparel"
                  onBack={() => {
                    router.back()
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderSection

OrderSection.getLayout = function getLayout(page) {
  return <PrimaryLayout>{page}</PrimaryLayout>
}
