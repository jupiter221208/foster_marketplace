import React, { useEffect, useState } from 'react'

// next components
import { useRouter } from 'next/router'

// third party components
import { useDispatch } from 'react-redux'
import Lottie from 'lottie-react'
import PreLoaderIcon from 'assets/lottery/preloader.json'

// swiper
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Lazy, Navigation } from 'swiper'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'

// components
import LiveAuctionCard from 'components/Card/LiveAuctionCard'

// custom functions
import { useViewport } from 'utils'

// resources
import TimeList from 'assets/json/home/time-list.json'

// styles
import styles from './index.module.scss'

// call apis
import dashboardAPI from 'apis/dashboard'
import SeeMoreButton from 'components/Button/SeeMoreButton'
import { DashboardAPIData } from 'types/nft'
import HomeFilterMenu from 'components/Menu/HomeFilterMenu'
import OutlineButton from 'components/Button/OutlineButton'

const LiveAuctionSection = props => {
  const { category, artist = '', fromPage = 'home', setLiveAuctionLoaded = null } = props
  const viewport = useViewport()
  const router = useRouter()
  const dispatch = useDispatch()

  const [liveAuctionList, setLiveAuctionList] = useState<DashboardAPIData[]>([])
  const [active, setActive] = useState<any>(1)
  const [cardLoop, setCardLoop] = useState(true)
  const [type, setType] = useState('recent_started')
  const [isLoaded, setIsLoaded] = useState(false)
  const [showSection, setShowSection] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [period, setPeriod] = useState(TimeList[1])

  useEffect(() => {
    getLiveAuctionsFromServer(category, artist, 'recent_started')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [artist, category])

  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

  useEffect(() => {
    if (liveAuctionList.length > 0) {
      ;(async () => {
        for (let index = 0; index < liveAuctionList.length; index++) {
          let data = liveAuctionList[index]
          fetch(`/nft/${data.token_id}`).then(e => e.text())
          if (index % 3 == 2) {
            await sleep(1000)
          }
        }
      })()
    }
  }, [liveAuctionList, router])

  const isExpired = endTime => {
    let endDate = new Date(endTime)
    let offsetEnd = endDate.getTimezoneOffset() * 60 * 1000
    let proposalEndTime = endDate.getTime() - offsetEnd

    let end_difference = proposalEndTime - new Date().getTime()
    if (end_difference < 0) return true
    return false
  }
  const getLiveAuctionsFromServer = (category, artist, mode) => {
    setIsLoading(true)
    dashboardAPI.getLiveAuctions(category, artist, mode, page).then(response => {
      if (setLiveAuctionLoaded) setLiveAuctionLoaded()
      setIsLoading(false)
      if (response !== null && response !== undefined && response.length !== 0) {
        let lists = []

        response.forEach(item => {
          if (!isExpired(item.end_time)) {
            if (
              (item.asset_url.length > 0 || item.cover_image_url.length > 0) &&
              item.artist_username?.length > 0 &&
              item.artist_profile_picture !== null
            ) {
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
        setIsLoaded(true)
        setLiveAuctionList([])
      }
    }),
      error => {
        if (setLiveAuctionLoaded) setLiveAuctionLoaded()
        setIsLoading(false)
        setIsLoaded(true)
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

  const removeExipredAuction = item => {
    let list = liveAuctionList.filter(auction => auction.token_id !== item.token_id)
    setLiveAuctionList(list)
  }

  return showSection ? (
    <section className={styles.container}>
      <div className="w-full flex justify-between items-center z-10 ml-[5px]">
        <div className="sm:block hidden">
          <HomeFilterMenu
            label="Live Auctions"
            data={TimeList}
            selectedItem={period}
            setSelectedItem={item => {
              setPeriod(item)
              handleChangeActive(item.id)
            }}
          />
        </div>
        <div className="sm:hidden w-full flex justify-between items-center">
          <div className={fromPage === 'profile' ? styles.smallTitle : styles.title}>Live&nbsp;Auctions</div>
          <HomeFilterMenu
            label=""
            data={TimeList}
            selectedItem={period}
            setSelectedItem={item => {
              setPeriod(item)
              handleChangeActive(item.id)
            }}
          />
        </div>
        <div className="z-10 sm:block hidden">
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
      <div className="w-full mt-[25px] lg:mt-[30px] z-10">
        {isLoading ? (
          <div className="w-full h-[400px] flex justify-center">
            <div className="w-[500px] h-[40px]">
              <Lottie width={500} height={40} animationData={PreLoaderIcon} loop={true} />
            </div>
          </div>
        ) : (
          <Swiper
            navigation={viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? true : false}
            slidesPerView={
              viewport === 'xs'
                ? 1.13
                : viewport === 'sm'
                ? 1.92
                : viewport === 'md'
                ? 2
                : viewport === '2xl'
                ? 5
                : viewport === 'xl'
                ? 4
                : 4
            }
            spaceBetween={
              viewport === 'xs' ? 9 : viewport === 'sm' || viewport === 'md' ? 30 : viewport === 'lg' ? 30 : 30
            }
            modules={[Autoplay, Lazy, Navigation]}
            className={
              liveAuctionList.length > 5
                ? 'auctionNavigationSwiper'
                : (viewport === 'lg' || viewport === 'xl') && liveAuctionList.length > 4
                ? 'auctionNavigationSwiper'
                : 'noScrollNavigationSwiper'
            }
          >
            {liveAuctionList.map((item, index) => (
              <SwiperSlide key={index}>
                <LiveAuctionCard
                  data={item}
                  onClick={() => {
                    router.push('/nft/' + item.token_id)
                  }}
                  setCardExpired={item => {
                    removeExipredAuction(item)
                  }}
                  key={index}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
      {fromPage !== 'profile' && (
        <div className="w-full flex sm:hidden justify-center lg:mt-0 mt-[10px]">
          <div className="w-full max-w-[300px] z-10">
            <OutlineButton
              label="See More"
              fullWidth
              onClick={() => {
                dispatch({ type: 'set', exploreTab: 0 })
                dispatch({ type: 'set', availabilityFilter: 1 })
                dispatch({ type: 'set', artworkCategory: category })
                router.push('/explore')
              }}
              fontSize="16px"
              height="41px"
              borderRadius="8px"
            />
          </div>
        </div>
      )}
    </section>
  ) : isLoaded === false ? (
    <div className="w-full h-[300px] lg:h-[300px]" />
  ) : fromPage === 'profile' ? (
    <div className="w-full h-[30px] lg:h-[50px]" />
  ) : (
    <></>
  )
}

export default LiveAuctionSection
