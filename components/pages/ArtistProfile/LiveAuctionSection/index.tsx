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
import LoadingComponent from 'pages/explore/LoadingComponent'

// custom functions
import { useViewport } from 'utils'

// styles
import styles from './index.module.scss'

// call apis
import dashboardAPI from 'apis/dashboard'
import OutlineButton from 'components/Button/OutlineButton'
import NFTAuctionCard from 'components/Card/NFTAuctionCard'

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
  const [isLoading, setIsLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [rowCount, setRowCount] = useState(8)
  const [lists, setLists] = useState([])

  const [isMounted, setIsMounted] = useState(false)
  const [isFetching, setIsFetching] = useState(false)
  const [isVisibleFetching, setIsVisibleFetching] = useState(false)

  const getLiveAuctionsFromServer = (category, artist, mode, nextpage) => {
    setIsLoading(true)
    dashboardAPI.getLiveAuctions(category, artist, mode, nextpage).then(response => {
      if (setLiveAuctionLoaded) setLiveAuctionLoaded()
      setIsLoading(false)
      setIsMounted(true)
      setIsFetching(false)

      // response.forEach(item => {
      //   if (!isExpired(item.end_time)) {
      //     if (item.asset_url.length > 0) {
      //       if (viewport === 'xs' || viewport === 'md' || viewport === 'xs') {
      //         if (item.asset_type === 'video') {
      //           if (item.cover_image_url?.length > 0) lists.push(item)
      //         } else {
      //           lists.push(item)
      //         }
      //       } else {
      //         lists.push(item)
      //       }
      //     }
      //   }
      // })

      if (response.length === rowCount) {
        setIsVisibleFetching(true)
      } else setIsVisibleFetching(false)
      setLiveAuctionList([...liveAuctionList, ...response])

      if (isLoaded === false) {
        setShowSection(true)
        setIsLoaded(true)
      }
    }),
      error => {
        if (setLiveAuctionLoaded) setLiveAuctionLoaded()
        setIsMounted(true)
        setIsLoading(false)
        setIsFetching(false)
        console.log(error)
      }
  }

  useEffect(() => {
    getLiveAuctionsFromServer(category, artist, 'recent_started', page)
  }, [artist, category])

  const isExpired = endTime => {
    let endDate = new Date(endTime)
    let offsetEnd = endDate.getTimezoneOffset() * 60 * 1000
    let proposalEndTime = endDate.getTime() - offsetEnd

    let end_difference = proposalEndTime - new Date().getTime()
    if (end_difference < 0) return true
    return false
  }

  useEffect(() => {}, [liveAuctionList])

  useEffect(() => {
    if (isFetching) {
      setTimeout(() => {
        const nextpage = page + 1
        setPage(nextpage)
        getLiveAuctionsFromServer(category, artist, 'recent_started', nextpage)
      }, 2000)
    }
  }, [isFetching])

  return showSection ? (
    <section className={styles.container}>
      {fromPage !== 'profile' && (
        <div className="w-full lg:w-auto flex items-center gap-4 lg:gap-8 mb-[0px] lg:mb-[50px]">
          <div className={`w-full flex justify-center items-center z-10`}>
            <div className={fromPage === 'profile' ? styles.smallTitle : styles.title}>Live Auctions</div>
          </div>
        </div>
      )}
      <div className="w-full mt-[30px] lg:mt-[40px] z-10">
        {isLoading ? (
          <div className="w-full h-[400px] flex justify-center">
            <div className="w-[500px] h-[40px]">
              <Lottie width={500} height={40} animationData={PreLoaderIcon} loop={true} />
            </div>
          </div>
        ) : (
          <div className="grid sm:grid-cols-4 grid-cols-2 gap gap-[11px] lg:gap-[20px] xl:gap-[34px]">
            {liveAuctionList.map((item: any, index) => (
              <NFTAuctionCard
                image={item.asset_url}
                assetType={item.asset_type}
                coverImage={item.cover_image_url}
                currentBid={item.current_bid}
                reservePrice={item.reserve_price}
                endTime={item.end_time}
                onClick={() => {
                  dispatch({ type: 'set', isLoading: true })
                  router.push('/nft/' + item.token_id)
                }}
                key={index}
              />
            ))}
          </div>
        )}
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
      {isMounted && isVisibleFetching && (
        <div className="w-full mt-[20px]">
          <LoadingComponent isFetching={isFetching} setIsFetching={setIsFetching} />
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
