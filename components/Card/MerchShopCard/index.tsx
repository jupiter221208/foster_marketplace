import React, { useState, useEffect } from 'react'
// component
import ImageWithFoster from 'components/ImageWithFoster'

// swiper
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Lazy, Pagination, Navigation } from 'swiper'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'

//images
import SolanaLogoIcon from 'assets/icons/solana-logo-13x11.svg?component'
import BackIcon from 'assets/icons/back-arrow.svg?component'
import NextIcon from 'assets/icons/next-arrow.svg?component'

// styles
import styles from './index.module.scss'
import GradientButton from 'components/Button/GradientButton'

const MerchShopCard = props => {
  const { data } = props
  const [swiper, setSwiper] = useState(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [indicatorList, setIndicatorList] = useState([])

  const goNext = () => {
    if (swiper !== null) swiper.slideNext()
    setCurrentStep(swiper.activeIndex)
  }

  const goPrev = () => {
    if (swiper !== null) swiper.slidePrev()
    setCurrentStep(swiper.activeIndex)
  }

  const handleOnChange = () => {
    if (swiper) setCurrentStep(swiper.activeIndex)
  }

  useEffect(() => {
    let list = []
    data.assets.map((item, index) => {
      let step = currentStep % data.assets.length
      if (index === step) {
        list.push(true)
      } else {
        list.push(false)
      }
    })
    setIndicatorList(list)
  }, [currentStep])

  return (
    <div className={styles.container}>
      <Swiper
        slidesPerView={1}
        spaceBetween={0}
        pagination={{
          clickable: true,
        }}
        onSlideChange={handleOnChange}
        onSwiper={setSwiper}
        // className={'merchShopCardSwiper'}
        modules={[Autoplay, Lazy, Navigation, Pagination]}
        // loop
      >
        {data.assets.map((item, index) => (
          <SwiperSlide key={index}>
            <div key={index}>
              <div className={styles.imageArea}>
                <div className={styles.imageContent}>
                  <ImageWithFoster src={item} width={500} className="max-w-full max-h-full object-cover" />
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className={styles.bottomSection}>
        <div className="w-full flex justify-between mt-[20px] items-center">
          <div className={styles.controlBtn} onClick={goPrev}>
            <BackIcon />
          </div>
          <div className="gap-[14px] h-[5px] flex justify-around">
            {indicatorList.map((item, index) => (
              <div key={index} className={item ? styles.selected : styles.nonSelected} />
            ))}
          </div>
          <div className={styles.controlBtn} onClick={goNext}>
            <NextIcon />
          </div>
        </div>
        <div className="w-full mt-[15px] flex justify-between items-center">
          <div className={styles.nftName}>{data.productName}</div>
          <div className="flex gap-[4px] items-center">
            <div className="mt-[2px]">
              <SolanaLogoIcon />
            </div>
            <div className={styles.price}>{data.price}</div>
          </div>
        </div>
        <div className="w-full mt-[7px] flex justify-between items-center">
          <div className={styles.artistName}>{data.merchType}</div>
          <div className={styles.dollarPrice}>$642.00</div>
        </div>

        <div className={`${styles.divider} mt-[15px]`} />

        <div className="w-full mt-[15px] flex justify-between">
          <div>
            {/* <div className={styles.shareBtn}>
              <ShoppingCartIcon />
            </div>
            <div className={styles.shareBtn}>
              <ShareSocialIcon />
            </div> */}
            <div className={styles.saleType}>Open Supply</div>
            <div className={styles.saleCount}>3 sold</div>
          </div>
          <GradientButton
            borderRadius={10}
            label="Buy Now"
            backgroundColor01="var(--place-bid-minimum-color)"
            backgroundColor02="var(--place-bid-minimum-color)"
            color="var(--time-slog-bg)"
            width={106}
            height={42}
            fontSize={16}
            onClick={() => {}}
          />
        </div>
      </div>
    </div>
  )
}

export default MerchShopCard
