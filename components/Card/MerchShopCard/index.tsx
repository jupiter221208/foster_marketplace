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
import ThreeDotIcon from 'assets/icons/three-dot-icon-20x5.svg?component'

// styles
import styles from './index.module.scss'
import { getDateTimeLabel, getTimeDifference } from 'utils/helpers'
import { calculateAuctionTimeLeft } from 'utils/helpers'
import StoreMerchModal from 'components/Menu/StoreMerchModal'
import { getPriceValue } from 'utils/strings'
import StoreMerchActivateModal from 'components/Menu/StoreMerchActivateModal'
import MerchTypeIconMenu from 'components/Menu/MerchTypeIconMenu'

const MerchShopCard = props => {
  const { username, data } = props
  const router = useRouter()
  const { solToUsdRate } = useSolToUsdRate()
  const [swiper, setSwiper] = useState(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [indicatorList, setIndicatorList] = useState([])
  const [showTimer, setShowTimer] = useState(false)
  const [timeLeft, setTimeLeft] = useState<any>(null)
  const [openModal, setOpenModal] = useState(false)
  const [showActivateModal, setShowActivateModal] = useState(false)

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
    if (data.listed_master_edition !== null && data.listed_master_edition.endTime !== null) {
      let timeDiff = getTimeDifference(data.listed_master_edition.endTime)
      if (timeDiff > 0) {
        setShowTimer(true)
        setTimeLeft(calculateAuctionTimeLeft(data.listed_master_edition.endTime))
        const timer = setInterval(() => {
          let time_left = calculateAuctionTimeLeft(data.listed_master_edition.endTime)
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

  const gotoDetail = () => {
    if (data.master_edition_address === null) {
      router.push(`/${username}/merch/${data.id}`)
    } else {
      if (getTimeDifference(data.sale_start_at) <= 0) {
        if (data.master_edition_address?.length > 0) router.push(`/nft/${data.master_edition_address}`)
        else {
          setShowActivateModal(true)
        }
      }
    }
  }
  return (
    <div className={styles.container}>
      <div className={styles.topSection}>
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
          loop={true}
        >
          {data.fulfillment_type === 'foster'
            ? data.options.addons.map((item, index) => (
                <SwiperSlide key={index}>
                  <div className={styles.imageArea} onClick={() => gotoDetail()}>
                    <div className={styles.imageContent}>
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
                  <div className={styles.imageArea} onClick={() => gotoDetail()}>
                    <div className={styles.imageContentPhysical}>
                      <ImageWithFoster src={item} width={500} className="w-full h-full object-cover" />
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
          <div className="absolute left-0 bottom-[15px] w-full sm:flex flex justify-center z-[10]">
            <div className="gap-[14px] h-[5px] flex justify-around">
              {indicatorList.map((item, index) => (
                <div key={index} className={item ? styles.selected : styles.nonSelected} />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className={styles.bottomSection}>
        <div className="sm:flex hidden w-full mt-[15px] justify-between gap-[10px]">
          <div className={styles.nftName}>{data.name}</div>
          {(data.master_edition_address === null || data.master_edition_address?.length > 0) && (
            <div>
              <div className="sm:flex hidden gap-[4px] mt-1 items-center">
                <div className="mt-[2px]">
                  <SolanaLogoIcon />
                </div>
                <div className={styles.price}>
                  {(
                    data.selling_price / 100 / solToUsdRate +
                    (data.listed_master_edition
                      ? parseFloat(getPriceValue(Number(data.listed_master_edition.price)))
                      : 0)
                  ).toFixed(2)}
                </div>
              </div>
              <div className={`${styles.dollarPrice} sm:text-end text-start mt-[7px]`}>
                $
                {(
                  data.selling_price / 100 +
                  (data.listed_master_edition
                    ? solToUsdRate * parseFloat(getPriceValue(Number(data.listed_master_edition.price)))
                    : 0)
                ).toFixed(2)}
              </div>
            </div>
          )}
        </div>

        <div className="sm:hidden block w-full">
          <div className={styles.nftName}>{data.name}</div>
          <div>
            <div className="sm:flex hidden gap-[4px] mt-1 items-center">
              <div className="mt-[2px]">
                <SolanaLogoIcon />
              </div>
              <div className={styles.price}>
                {(
                  data.selling_price / 100 / solToUsdRate +
                  (data.listed_master_edition ? parseFloat(getPriceValue(Number(data.listed_master_edition.price))) : 0)
                ).toFixed(2)}
              </div>
            </div>
            <div className={`${styles.dollarPrice} sm:text-end text-start mt-[7px]`}>
              $
              {(
                data.selling_price / 100 +
                (data.listed_master_edition
                  ? solToUsdRate * parseFloat(getPriceValue(Number(data.listed_master_edition.price)))
                  : 0)
              ).toFixed(2)}
            </div>
          </div>
        </div>

        <div
          className="sm:hidden block absolute px-[10px] py-[15px] right-0 bottom-0"
          onClick={() => {
            setOpenModal(true)
          }}
        >
          <div>
            <ThreeDotIcon />
          </div>
        </div>
        <div className={`${styles.divider} mt-[15px] sm:block hidden`} />

        <div className="w-full sm:block hidden">
          <div className="w-full mt-[15px] sm:mt-[15px]">
            {getTimeDifference(data.sale_start_at) > 0 ? (
              <div>
                <div className={styles.saleType}>Goes live on </div>
                {data.master_edition_address === null ? (
                  <div className={styles.saleCount}>{getDateTimeLabel(new Date(data.sale_start_at))}</div>
                ) : (
                  <div className={styles.saleCount}>TBD</div>
                )}
              </div>
            ) : data.master_edition_address?.length === 0 ? (
              <div>
                <div className="w-full flex justify-between">
                  <div className={styles.saleType}>Goes live on</div>
                </div>
                <div className={styles.saleCount}>TBD</div>
              </div>
            ) : data.listed_master_edition !== null && getTimeDifference(data.listed_master_edition.startTime) > 0 ? (
              <div>
                <div className="w-full flex justify-between">
                  <div className={styles.saleType}>Goes live on</div>
                </div>
                <div className={styles.saleCount}>
                  {getDateTimeLabel(new Date(data.listed_master_edition.startTime))}
                </div>
              </div>
            ) : (
              <div>
                <div className="w-full flex justify-between">
                  <div className={styles.saleType}>{data.supply ? 'Limited Supply' : 'Open Supply'}</div>
                </div>
                <div className="w-full flex justify-between">
                  <div className={styles.saleCount}>
                    {data.supply
                      ? `${data.supply - data.current_supply}/${data.supply} left`
                      : `${data.current_supply} sold`}
                  </div>
                  <div className="flex gap-[10px]">
                    {showTimer && <MerchTypeIconMenu type={'timer'} timeLeft={timeLeft} />}
                    <MerchTypeIconMenu
                      type={data.master_edition_address?.length > 0 ? 'edition' : data.fulfillment_type}
                      timeLeft={null}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {openModal && (
        <StoreMerchModal
          open={openModal}
          close={() => setOpenModal(false)}
          item={data}
          startDate={data.sale_start_at}
          showTimer={showTimer}
          timeLeft={timeLeft}
          onBuyNow={() => {
            setOpenModal(false)
            gotoDetail()
          }}
        />
      )}

      {showActivateModal && (
        <StoreMerchActivateModal
          open={showActivateModal}
          close={() => setShowActivateModal(false)}
          username={username}
        />
      )}
    </div>
  )
}

export default MerchShopCard
