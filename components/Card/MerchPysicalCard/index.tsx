import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useSolToUsdRate } from 'hooks/useSolToUsdRate'

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
import ProductTypeList from 'assets/json/merch-shop/product-type-list.json'

// styles
import styles from './index.module.scss'
import GradientButton from 'components/Button/GradientButton'
import { useDispatch } from 'react-redux'

const MerchPhysicalCard = props => {
  const { username, data } = props
  const router = useRouter()
  const dispatch = useDispatch()
  const { solToUsdRate } = useSolToUsdRate()
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
    data.options.product_images.map((item, index) => {
      let step = currentStep % data.options.product_images.length
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
      <div className="relative">
        <Swiper
          slidesPerView={1}
          spaceBetween={10}
          pagination={{
            clickable: true,
          }}
          onSlideChange={handleOnChange}
          onSwiper={setSwiper}
          // className={'merchShopCardSwiper'}
          modules={[Autoplay, Lazy, Navigation, Pagination]}
          // loop
        >
          {data.options.product_images.map((item, index) => (
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
        {indicatorList.length > 1 && (
          <div className="absolute left-0 top-[46%] w-full flex justify-between items-center px-[20px]">
            <div className={styles.controlBtn} onClick={goPrev}>
              <BackIcon />
            </div>

            <div className={styles.controlBtn} onClick={goNext}>
              <NextIcon />
            </div>
          </div>
        )}
        {indicatorList.length > 1 && (
          <div className="absolute left-0 bottom-[15px] w-full flex justify-center z-[100]">
            <div className="gap-[14px] h-[5px] flex justify-around">
              {indicatorList.map((item, index) => (
                <div key={index} className={item ? styles.selected : styles.nonSelected} />
              ))}
            </div>
          </div>
        )}
      </div>
      <div className={styles.bottomSection}>
        <div className="w-full mt-[20px] flex justify-between gap-[10px]">
          <div className={styles.nftName}>{data.name}</div>
          <div>
            <div className="flex gap-[4px] mt-[4px] items-center">
              <div className="mt-[2px]">
                <SolanaLogoIcon />
              </div>
              <div className={styles.price}>{(data.selling_price / 100 / solToUsdRate).toFixed(2)}</div>
            </div>
            <div className={`${styles.dollarPrice} text-end mt-[7px]`}>${(data.selling_price / 100).toFixed(2)}</div>
          </div>
        </div>
        {/* <div className="w-full mt-[7px] flex justify-between items-center">
          <div className={styles.artistName}>{ProductTypeList[data.product_type_id - 1].name}</div>
        </div> */}

        <div className={`${styles.divider} mt-[15px]`} />

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
              dispatch({ type: 'set', merchOrderType: 'user' })
              router.push(`/${username}/merch/${data.id}`)
            }}
          />
        </div>
      </div>
      {/* <FullScreenLoadingModal open={isLoading} /> */}
    </div>
  )
}

export default MerchPhysicalCard
