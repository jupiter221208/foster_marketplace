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
import ClockSandIcon from 'assets/icons/clock-sand-icon.svg?component'

// styles
import styles from './index.module.scss'
import GradientButton from 'components/Button/GradientButton'
import { useDispatch } from 'react-redux'
import { getTimeDifference } from 'utils/helpers'
import { calculateAuctionTimeLeft } from 'utils/helpers'

const MerchShopCard = props => {
  const { type = 'foster', username, data } = props
  const dispatch = useDispatch()
  const router = useRouter()
  const { solToUsdRate } = useSolToUsdRate()
  const [swiper, setSwiper] = useState(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [indicatorList, setIndicatorList] = useState([])
  const [showTimer, setShowTimer] = useState(false)
  const [timeLeft, setTimeLeft] = useState<any>(null)

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
    if (data.sale_end_at !== null) {
      let timeDiff = getTimeDifference(data.sale_end_at)
      if (timeDiff > 0) {
        setShowTimer(true)
        setTimeLeft(calculateAuctionTimeLeft(data.sale_end_at))
        const timer = setInterval(() => {
          let time_left = calculateAuctionTimeLeft(data.sale_end_at)
          setTimeLeft(time_left)
        }, 1000)

        return () => {
          clearTimeout(timer)
        }
      }
    }
  }, [data])

  useEffect(() => {
    let list = []
    if (data.fulfillment_type === 'foster') {
      data.options.addons.map((item, index) => {
        let step = currentStep % data.options.addons.length
        if (index === step) {
          list.push(true)
        } else {
          list.push(false)
        }
      })
    } else {
      data.options.product_images.map((item, index) => {
        let step = currentStep % data.options.product_images.length
        if (index === step) {
          list.push(true)
        } else {
          list.push(false)
        }
      })
    }

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
          className={styles.swiperContainer}
          modules={[Autoplay, Lazy, Navigation, Pagination]}
          // loop
        >
          {data.fulfillment_type === 'foster'
            ? data.options.addons.map((item, index) => (
                <SwiperSlide key={index}>
                  <div className={styles.imageArea}>
                    <div
                      className={styles.imageContent}
                      onClick={() => {
                        dispatch({ type: 'set', merchOrderType: 'foster' })
                        router.push(`/${username}/merch/${data.id}`)
                      }}
                    >
                      <ImageWithFoster
                        src={item.mockup_url}
                        width={500}
                        className="max-w-full max-h-full object-cover"
                      />
                    </div>
                  </div>
                </SwiperSlide>
              ))
            : data.options.product_images.map((item, index) => (
                <SwiperSlide key={index}>
                  <div className={styles.imageArea}>
                    <div
                      className={styles.imageContent}
                      onClick={() => {
                        dispatch({ type: 'set', merchOrderType: 'foster' })
                        router.push(`/${username}/merch/${data.id}`)
                      }}
                    >
                      <ImageWithFoster src={item} width={500} className="max-w-full max-h-full object-cover" />
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
          <div className="absolute left-0 bottom-[15px] w-full sm:flex hidden justify-center z-[10]">
            <div className="gap-[14px] h-[5px] flex justify-around">
              {indicatorList.map((item, index) => (
                <div key={index} className={item ? styles.selected : styles.nonSelected} />
              ))}
            </div>
          </div>
        )}
        {showTimer && (
          <div className={styles.timerBG}>
            <ClockSandIcon />
            <div className="flex gap-[4px]">
              {timeLeft && timeLeft['days'] !== '00' && (
                <div className="flex block justify-center gap-[2px]">
                  <div className={styles.grayTime}>{timeLeft['days']}</div>
                  <div className={styles.grayText}>d</div>
                </div>
              )}
              {timeLeft && timeLeft['hours'] !== '00' && (
                <div className="flex block justify-center gap-[2px]">
                  <div className={styles.grayTime}>{timeLeft['hours']}</div>
                  <div className={styles.grayText}>h</div>
                </div>
              )}
              {timeLeft && timeLeft['minutes'] !== '00' && (
                <div className="flex block justify-center gap-[2px]">
                  <div className={styles.grayTime}>{timeLeft && timeLeft['minutes']}</div>
                  <div className={styles.grayText}>m</div>
                </div>
              )}
              {timeLeft && timeLeft['seconds'] !== '00' && (
                <div className="flex block justify-center gap-[2px]">
                  <div className={styles.grayTime}>{timeLeft && timeLeft['seconds']}</div>
                  <div className={styles.grayText}>s</div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className={styles.bottomSection}>
        {indicatorList.length > 1 ? (
          <div className="w-full flex sm:hidden justify-center mt-[30px]">
            <div className="gap-[14px] h-[5px] flex justify-around">
              {indicatorList.map((item, index) => (
                <div key={index} className={item ? styles.selected : styles.nonSelected} />
              ))}
            </div>
          </div>
        ) : (
          <div className="w-full flex sm:hidden h-[20px]" />
        )}

        <div className="w-full mt-[10px] sm:mt-[15px] sm:flex sm:flex-row flex-col justify-between gap-[10px]">
          <div className={styles.nftName}>{data.name}</div>
          <div>
            <div className="sm:flex hidden gap-[4px] mt-1 items-center">
              <div className="mt-[2px]">
                <SolanaLogoIcon />
              </div>
              <div className={styles.price}>{(data.selling_price / 100 / solToUsdRate).toFixed(2)}</div>
            </div>
            <div className={`${styles.dollarPrice} sm:text-end text-start mt-[7px]`}>
              ${(data.selling_price / 100).toFixed(2)}
            </div>
          </div>
        </div>

        <div className={`${styles.divider} mt-[15px] sm:mt-[15px]`} />

        {data.fulfillment_type === 'foster' ? (
          <div className="w-full mt-[15px] sm:mt-[15px] flex justify-between">
            {getTimeDifference(data.sale_start_at) > 0 ? (
              <div>
                <div className={styles.saleType}>Goes live on </div>
                <div className={styles.saleCount}>TBD</div>
              </div>
            ) : (
              <div>
                <div className={styles.saleType}>{data.supply ? 'Limited Supply' : 'Open Supply'}</div>
                <div className={styles.saleCount}>
                  {data.supply ? `${data.current_supply}/${data.supply} left` : `${data.current_supply} sold`}
                </div>
              </div>
            )}

            {getTimeDifference(data.sale_start_at) <= 0 && (
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
                    dispatch({ type: 'set', merchOrderType: 'foster' })
                    router.push(`/${username}/merch/${data.id}`)
                  }}
                />
              </div>
            )}
          </div>
        ) : (
          <div className="w-full mt-[15px] flex justify-between">
            {getTimeDifference(data.sale_start_at) > 0 ? (
              <div>
                <div className={styles.saleType}>Goes live on </div>
                <div className={styles.saleCount}>TBD</div>
              </div>
            ) : (
              <div>
                <div className={styles.saleType}>{data.supply ? 'Limited Supply' : 'Open Supply'}</div>
                <div className={styles.saleCount}>
                  {data.supply ? `${data.current_supply}/${data.supply} left` : `${data.current_supply} sold`}
                </div>
              </div>
            )}

            {getTimeDifference(data.sale_start_at) <= 0 && data.master_edition_address?.length > 0 && (
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
                  // dispatch({ type: 'set', merchOrderType: 'foster' })
                  router.push(`/nft/${data.master_edition_address}`)
                }}
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default MerchShopCard
