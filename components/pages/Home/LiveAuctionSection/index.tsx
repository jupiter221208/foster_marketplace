import React, { useEffect, useState } from 'react'

// next components
import { useRouter } from 'next/router'

// third party components
import { useDispatch } from 'react-redux'

// swiper
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Lazy, Navigation } from 'swiper'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'

// components
import Button from 'components/Button'
import LiveAuctionCard from 'components/Card/LiveAuctionCard'

// custom functions
import { useViewport } from 'utils'

// styles
import styles from './index.module.scss'

// call apis
import dashboardAPI from 'apis/dashboard'
import OutlineButton from 'components/Button/OutlineButton'
import SeeMoreButton from 'components/Button/SeeMoreButton'
import TimeSlotButton from 'components/Button/TimeSlotButton'

const LiveAuctionSection = props => {
  const { category, artist = '', fromPage = 'home' } = props
  const viewport = useViewport()
  const router = useRouter()
  const dispatch = useDispatch()

  const [allListAuctionList, setAllLiveAuctionList] = useState<any[]>([])
  const [liveAuctionList, setLiveAuctionList] = useState<any[]>([])
  const [active, setActive] = useState<any>(1)
  const [cardLoop, setCardLoop] = useState(true)
  const [type, setType] = useState('recent_started')

  useEffect(() => {
    getLiveAuctionsFromServer(category, artist, 'recent_started')
  }, [artist, category])

  const getLiveAuctionsFromServer = (category, artist, mode) => {
    dashboardAPI.getLiveAuctions(category, artist, mode).then(response => {
      if (response !== null && response !== undefined && response.length !== 0) {
        let lists = []
        response.forEach(item => {
          if (item.asset_url.length > 0) {
            if (viewport === 'xs' || viewport === 'md' || viewport === 'xs') {
              if (item.cover_image_url?.length > 0) lists.push(item)
            } else {
              lists.push(item)
            }
          }
        })
        setAllLiveAuctionList(lists)
        setLiveAuctionList(lists)
        if (lists.length > 3) setCardLoop(true)
        else setCardLoop(false)
      } else {
        setAllLiveAuctionList([])
        setLiveAuctionList([])
      }
    }),
      error => {
        console.log(error)
      }
  }
  const handleChangeActive = value => {
    setActive(value)

    switch (value) {
      case 0:
        getLiveAuctionsFromServer(category, artist, 'upcoming')
        setType('upcoming')
        break
      case 1:
        getLiveAuctionsFromServer(category, artist, 'recent_started')
        setType('recent_started')
        break
      case 2:
        getLiveAuctionsFromServer(category, artist, 'end_soon')
        setType('end_soon')
        break
      default:
        getLiveAuctionsFromServer(category, artist, 'recent_started')
        setType('recent_started')
        break
    }
  }

  return (
    fromPage === 'home' ||
    (type === 'recent_started' && liveAuctionList.length > 0 && (
      <section className={styles.container}>
        <div className={styles.topLeftEllipse} />
        <div className="w-full flex justify-between items-center z-10">
          <div className="w-full lg:w-auto flex justify-center lg:justify-start items-center gap-4 lg:gap-8">
            <div className="w-full lg:w-auto flex justify-center lg:justify-start items-center gap-4 lg:gap-8">
              {viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? (
                <div className="w-full flex justify-center items-center z-10">
                  <div className={styles.title}>Live Auctions</div>
                </div>
              ) : (
                <div className={`${styles.title} mr-0 lg:mr-6 xl:mr-8`}>Live Auctions</div>
              )}
            </div>
            <div className="hidden lg:flex justify-between gap-[10px] lg:gap-[30px] xl:gap-[50px]">
              <TimeSlotButton
                label="Starting Soon"
                onClick={() => handleChangeActive(0)}
                fontFamily={active === 0 ? 'Muli-Bold' : 'Muli-SemiBold'}
                color={active === 0 ? 'var(--day-btn-color)' : '#979EA2'}
                backgroundColor01={active === 0 ? 'var(--day-btn-bg-1)' : 'transparent'}
                backgroundColor02={active === 0 ? 'var(--day-btn-bg-2)' : 'transparent'}
                gradientDirection="bottom"
              />
              <TimeSlotButton
                label="Recently Started"
                onClick={() => handleChangeActive(1)}
                fontFamily={active === 1 ? 'Muli-Bold' : 'Muli-SemiBold'}
                color={active === 1 ? 'var(--day-btn-color)' : '#979EA2'}
                backgroundColor01={active === 1 ? 'var(--day-btn-bg-1)' : 'transparent'}
                backgroundColor02={active === 1 ? 'var(--day-btn-bg-2)' : 'transparent'}
                gradientDirection="bottom"
              />
              <TimeSlotButton
                label="Ending Soon"
                onClick={() => handleChangeActive(2)}
                fontFamily={active === 2 ? 'Muli-Bold' : 'Muli-SemiBold'}
                color={active === 2 ? 'var(--day-btn-color)' : '#979EA2'}
                backgroundColor01={active === 2 ? 'var(--day-btn-bg-1)' : 'transparent'}
                backgroundColor02={active === 2 ? 'var(--day-btn-bg-2)' : 'transparent'}
                gradientDirection="bottom"
              />
            </div>
          </div>
          <div className="hidden lg:flex z-10">
            <SeeMoreButton
              onClick={() => {
                dispatch({ type: 'set', exploreTab: 0 })
                dispatch({ type: 'set', availabilityFilter: 1 })
                dispatch({ type: 'set', artworkCategory: category })
                router.push('/explore')
              }}
            />
          </div>
        </div>
        <div className="w-full mt-[15px] lg:mt-[34px] z-10">
          <Swiper
            navigation={viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? true : false}
            slidesPerView={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 1.4 : 3.02}
            spaceBetween={
              viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 11 : viewport === 'lg' ? 20 : 40
            }
            modules={[Autoplay, Lazy, Navigation]}
            className="navigationSwiper"
            loop={cardLoop}
            // autoplay={{
            //   delay: 5000,
            //   disableOnInteraction: false,
            // }}
          >
            {liveAuctionList.map((item: any, index) => (
              <SwiperSlide key={index}>
                <LiveAuctionCard
                  data={item}
                  onClick={() => {
                    dispatch({ type: 'set', isLoading: true })
                    router.push('/browse-nft?id=' + item.token_id)
                  }}
                  key={index}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div className="w-full flex lg:hidden justify-center">
          <div className="w-full max-w-[242px] z-10">
            <OutlineButton
              label="See More"
              fullWidth
              onClick={() => {
                dispatch({ type: 'set', exploreTab: 0 })
                dispatch({ type: 'set', availabilityFilter: 1 })
                dispatch({ type: 'set', artworkCategory: category })
                router.push('/explore')
              }}
              borderColor={'var(--see-more-border)'}
              height="40px"
            />
          </div>
        </div>
      </section>
    ))
  )
}

export default LiveAuctionSection
