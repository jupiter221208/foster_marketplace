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
  const { category, artist = '', fromPage = 'home', setLiveAuctionLoaded = null } = props
  const viewport = useViewport()
  const router = useRouter()
  const dispatch = useDispatch()

  const [liveAuctionList, setLiveAuctionList] = useState<any[]>([])
  const [active, setActive] = useState<any>(1)
  const [cardLoop, setCardLoop] = useState(true)
  const [type, setType] = useState('recent_started')
  const [isLoaded, setIsLoaded] = useState(false)
  const [showSection, setShowSection] = useState(false)
  useEffect(() => {
    getLiveAuctionsFromServer(category, artist, 'recent_started')
  }, [artist, category])

  const isExpired = endTime => {
    let endDate = new Date(endTime)
    let offsetEnd = endDate.getTimezoneOffset() * 60 * 1000
    let proposalEndTime = endDate.getTime() - offsetEnd

    let end_difference = proposalEndTime - new Date().getTime()
    if (end_difference < 0) return true
    return false
  }
  const getLiveAuctionsFromServer = (category, artist, mode) => {
    dashboardAPI.getLiveAuctions(category, artist, mode).then(response => {
      if (setLiveAuctionLoaded) setLiveAuctionLoaded()

      if (response !== null && response !== undefined && response.length !== 0) {
        let lists = []
        response.forEach(item => {
          if (!isExpired(item.end_time)) {
            if (item.asset_url.length > 0) {
              if (viewport === 'xs' || viewport === 'md' || viewport === 'xs') {
                if (item.asset_type === 'video') {
                  if (item.cover_image_url?.length > 0) lists.push(item)
                } else {
                  lists.push(item)
                }
              } else {
                lists.push(item)
              }
            }
          }
        })
        setLiveAuctionList(lists)
        if (lists.length > 3) setCardLoop(true)
        else setCardLoop(false)

        if (isLoaded === false) {
          setShowSection(true)
          setIsLoaded(true)
        }
      } else {
        setLiveAuctionList([])
      }
    }),
      error => {
        if (setLiveAuctionLoaded) setLiveAuctionLoaded()
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

  useEffect(() => {}, [liveAuctionList])

  return showSection ? (
    <section className={styles.container}>
      <div className="w-full flex justify-between items-center z-10">
        <div className="w-full lg:w-auto flex justify-center lg:justify-start items-center gap-4 lg:gap-8">
          <div className="w-full lg:w-auto flex justify-center lg:justify-start items-center gap-4 lg:gap-8">
            {viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? (
              <div
                className={`${
                  fromPage === 'profile' ? 'justify-start' : 'justify-center'
                } w-full flex items-center z-10`}
              >
                <div className={fromPage === 'profile' ? styles.smallTitle : styles.title}>Live Auctions</div>
              </div>
            ) : (
              <div className={`${fromPage === 'profile' ? styles.smallTitle : styles.title} mr-0 lg:mr-6 xl:mr-8`}>
                Live&nbsp;Auctions
              </div>
            )}
          </div>
          <div className="hidden lg:flex w-full h-[54px] z-10">
            <div className={styles.slotBG}>
              <TimeSlotButton
                label="Starting Soon"
                onClick={() => handleChangeActive(0)}
                fontFamily={'Muli-SemiBold'}
                color={active === 0 ? 'var(--search-menu-icon-color)' : '#979EA2'}
                backgroundColor01={active === 0 ? 'var(--time-slog-bg)' : 'transparent'}
                backgroundColor02={active === 0 ? 'var(--time-slog-bg)' : 'transparent'}
                gradientDirection="bottom"
                width={140}
                boxShadow={active === 0 ? '0px 0px 10px rgba(32, 36, 39, 0.15)' : ''}
              />
              <TimeSlotButton
                label="New"
                onClick={() => handleChangeActive(1)}
                fontFamily={'Muli-SemiBold'}
                color={active === 1 ? 'var(--search-menu-icon-color)' : '#979EA2'}
                backgroundColor01={active === 1 ? 'var(--time-slog-bg)' : 'transparent'}
                backgroundColor02={active === 1 ? 'var(--time-slog-bg)' : 'transparent'}
                gradientDirection="bottom"
                width={86}
                boxShadow={active === 1 ? '0px 0px 10px rgba(32, 36, 39, 0.15)' : ''}
              />
              <TimeSlotButton
                label="Ending Soon"
                onClick={() => handleChangeActive(2)}
                fontFamily={'Muli-SemiBold'}
                color={active === 2 ? 'var(--search-menu-icon-color)' : '#979EA2'}
                backgroundColor01={active === 2 ? 'var(--time-slog-bg)' : 'transparent'}
                backgroundColor02={active === 2 ? 'var(--time-slog-bg)' : 'transparent'}
                gradientDirection="bottom"
                width={140}
                boxShadow={active === 2 ? '0px 0px 10px rgba(32, 36, 39, 0.15)' : ''}
              />
            </div>
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
      <div className="w-full flex lg:hidden h-[54px] mt-[15px] z-10">
        <div className={styles.slotBG}>
          <TimeSlotButton
            label="Starting Soon"
            onClick={() => handleChangeActive(0)}
            fontFamily={'Muli-SemiBold'}
            color={active === 0 ? 'var(--search-menu-icon-color)' : '#979EA2'}
            backgroundColor01={active === 0 ? 'var(--time-slog-bg)' : 'transparent'}
            backgroundColor02={active === 0 ? 'var(--time-slog-bg)' : 'transparent'}
            gradientDirection="bottom"
            width={124}
            boxShadow={active === 0 ? '0px 0px 10px rgba(32, 36, 39, 0.15)' : ''}
          />
          <TimeSlotButton
            label="New"
            onClick={() => handleChangeActive(1)}
            fontFamily={'Muli-SemiBold'}
            color={active === 1 ? 'var(--search-menu-icon-color)' : '#979EA2'}
            backgroundColor01={active === 1 ? 'var(--time-slog-bg)' : 'transparent'}
            backgroundColor02={active === 1 ? 'var(--time-slog-bg)' : 'transparent'}
            gradientDirection="bottom"
            width={86}
            boxShadow={active === 1 ? '0px 0px 10px rgba(32, 36, 39, 0.15)' : ''}
          />
          <TimeSlotButton
            label="Ending Soon"
            onClick={() => handleChangeActive(2)}
            fontFamily={'Muli-SemiBold'}
            color={active === 2 ? 'var(--search-menu-icon-color)' : '#979EA2'}
            backgroundColor01={active === 2 ? 'var(--time-slog-bg)' : 'transparent'}
            backgroundColor02={active === 2 ? 'var(--time-slog-bg)' : 'transparent'}
            gradientDirection="bottom"
            width={124}
            boxShadow={active === 2 ? '0px 0px 10px rgba(32, 36, 39, 0.15)' : ''}
          />
        </div>
      </div>
      <div className="w-full mt-[30px] lg:mt-[34px] z-10">
        <Swiper
          navigation={viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? true : false}
          slidesPerView={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 1.07 : 3}
          spaceBetween={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 11 : viewport === 'lg' ? 20 : 40}
          modules={[Autoplay, Lazy, Navigation]}
          className={liveAuctionList.length > 3 ? 'auctionNavigationSwiper' : 'noScrollNavigationSwiper'}
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
                  router.push('/nft/' + item.token_id)
                }}
                key={index}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      {fromPage !== 'profile' && (
        <div className="w-full flex lg:hidden justify-center lg:mt-0 mt-[15px]">
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
      )}
    </section>
  ) : fromPage === 'profile' ? (
    <div className="w-full h-[30px] lg:h-[50px]" />
  ) : (
    <></>
  )
}

export default LiveAuctionSection
