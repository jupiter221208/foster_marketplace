import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

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
import { useDispatch } from 'react-redux'

const MerchShopCard = props => {
  const { type = 'merch', username, data } = props
  const router = useRouter()
  const dispatch = useDispatch()
  const [swiper, setSwiper] = useState(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [indicatorList, setIndicatorList] = useState([])
  // const [isLoading, setIsLoading] = useState(false)

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep])

  return (
    <div className={styles.container}>
      <Swiper
        slidesPerView={1}
        spaceBetween={10}
        pagination={{
          clickable: true,
        }}
        onSlideChange={handleOnChange}
        onSwiper={setSwiper}
        className={styles.swiperContainer}
        modules={[Autoplay, Lazy, Navigation, Pagination]}
        // loop
      >
        {data.assets.map((item, index) => (
          <SwiperSlide key={index}>
            <div key={index}>
              <div className={styles.imageArea}>
                <div
                  className={styles.imageContent}
                  onClick={() => {
                    dispatch({ type: 'set', merchOrderType: type })
                    router.push(`/${username}/merch/${data.id}`)
                  }}
                >
                  <ImageWithFoster src={item.src} width={500} className="max-w-full max-h-full object-cover" />
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className={styles.bottomSection}>
        <div className="w-full flex justify-between mt-[10px] sm:mt-[20px] items-center">
          <div className={styles.controlBtn} onClick={goPrev}>
            <BackIcon />
          </div>
          <div className="w-full flex justify-center">
            <div className="gap-[14px] h-[5px] flex justify-around">
              {indicatorList.map((item, index) => (
                <div key={index} className={item ? styles.selected : styles.nonSelected} />
              ))}
            </div>
          </div>
          <div className={styles.controlBtn} onClick={goNext}>
            <NextIcon />
          </div>
        </div>
        <div className="w-full mt-[10px] sm:mt-[15px] flex justify-between items-center">
          <div className={styles.nftName}>{data.productName}</div>
          <div className="sm:flex hidden gap-[4px] items-center">
            <div className="mt-[2px]">
              <SolanaLogoIcon />
            </div>
            <div className={styles.price}>{data.price}</div>
          </div>
        </div>

        <div className="w-full mt-[7px] flex justify-between items-center">
          <div className={`sm:block hidden ${styles.artistName}`}>{data.merchType}</div>
          <div className={styles.dollarPrice}>$642.00</div>
        </div>

        <div className={`${styles.divider} mt-[8px] sm:mt-[15px]`} />

        {type === 'merch' ? (
          <div className="w-full mt-[8px] sm:mt-[15px] flex justify-between">
            <div>
              <div className={styles.saleType}>Open Supply</div>
              <div className={styles.saleCount}>3 sold</div>
            </div>
            <div className="sm:block hidden">
              <GradientButton
                borderRadius={10}
                label="Buy Now"
                backgroundColor01="var(--place-bid-minimum-color)"
                backgroundColor02="var(--place-bid-minimum-color)"
                color="var(--time-slog-bg)"
                width={106}
                height={42}
                fontSize={16}
                onClick={() => {
                  dispatch({ type: 'set', merchOrderType: type })
                  router.push(`/${username}/merch/${data.id}`)
                }}
              />
            </div>
          </div>
        ) : (
          <div className="w-full mt-[15px] flex justify-between">
            <GradientButton
              borderRadius={10}
              label="Buy Now"
              backgroundColor01="var(--place-bid-minimum-color)"
              backgroundColor02="var(--place-bid-minimum-color)"
              color="var(--time-slog-bg)"
              fullWidth
              height={42}
              fontSize={16}
              onClick={() => {
                // setIsLoading(true)
                dispatch({ type: 'set', merchOrderType: type })
                router.push(`/${username}/merch/${data.id}`)
              }}
            />
          </div>
        )}
      </div>
      {/* <FullScreenLoadingModal open={isLoading} /> */}
    </div>
  )
}

export default MerchShopCard
