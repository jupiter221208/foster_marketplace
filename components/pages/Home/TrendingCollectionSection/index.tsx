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
import TrendingCollectionCard from 'components/Card/TrendingCollectionCard'

// custom functions
import { useViewport } from 'utils'

// images
import DayList from 'assets/json/home/day-list.json'

// styles
import styles from './index.module.scss'
import ArrowRightGreenIcon from 'assets/icons/arrow-right-white-medium.svg?component'

// call apis
import dashboardAPI from 'apis/dashboard'
import SeeMoreButton from 'components/Button/SeeMoreButton'
import TimeSlotButton from 'components/Button/TimeSlotButton'
import { DashboardAPIData } from 'types/nft'
import HomeFilterMenu from 'components/Menu/HomeFilterMenu'

const TrendingCollectionSection = props => {
  const { category, loop } = props
  const viewport = useViewport()
  const router = useRouter()
  const dispatch = useDispatch()
  const [trendingList, setTrendingList] = useState<DashboardAPIData[]>([])
  const [active, setActive] = useState<any>(1)
  const [isLoading, setIsLoading] = useState(false)
  const [period, setPeriod] = useState(DayList[2])

  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

  useEffect(() => {
    if (trendingList.length > 0) {
      ;(async () => {
        for (let index = 0; index < trendingList.length; index++) {
          let data = trendingList[index]
          fetch(`/nft/${data.token_id}`).then(e => e.text())
          if (index % 3 == 2) {
            await sleep(1000)
          }
        }
      })()
    }
  }, [trendingList, router])

  useEffect(() => {
    setTrendingList([])
    getTrendingCollectionsFromServer(category, 'week')
  }, [category])

  const getTrendingCollectionsFromServer = (category, period) => {
    setIsLoading(true)
    dashboardAPI.getTrendingCollections(category, period).then(
      response => {
        setIsLoading(false)
        if (response instanceof Array) {
          setTrendingList(response)
        }
      },
      error => {
        setIsLoading(false)
        console.log(error)
      }
    )
  }

  const handleChangeActive = value => {
    setActive(value)

    switch (value) {
      case 0:
        getTrendingCollectionsFromServer(category, 'day')
        break
      case 1:
        getTrendingCollectionsFromServer(category, 'week')
        break
      case 2:
        getTrendingCollectionsFromServer(category, 'month')
        break
      case 3:
        getTrendingCollectionsFromServer(category, 'all')
        break
      default:
        getTrendingCollectionsFromServer(category, 'week')
        break
    }
  }

  return (
    (category.length === 0 || trendingList.length > 0) && (
      <section className={styles.container}>
        <div className="w-full flex justify-between items-center z-10">
          <div>
            <div className={styles.title}>Trending&nbsp;Collections</div>
            <HomeFilterMenu
              label={period['label']}
              data={DayList}
              selectedItem={period}
              setSelectedItem={item => {
                setPeriod(item)
                handleChangeActive(item.id)
              }}
            />
          </div>
          <div>
            <SeeMoreButton
              onClick={() => {
                dispatch({ type: 'set', exploreTab: 1 })
                dispatch({ type: 'set', collectionSort: 'trending' })
                dispatch({ type: 'set', collectionCategory: category })
                router.push('/explore')
              }}
            />
          </div>
        </div>
        {isLoading ? (
          <div className="w-full h-[500px] flex justify-center">
            <div className="w-[500px] h-[40px] mt-[100px]">
              <Lottie width={500} height={40} animationData={PreLoaderIcon} loop={true} />
            </div>
          </div>
        ) : (
          <div className="w-full mt-[30px] lg:mt-[34px] z-10 pb-[0px] lg:pb-[30px]">
            {trendingList !== null && trendingList !== undefined && trendingList.length !== 0 && (
              <Swiper
                navigation={viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? true : false}
                slidesPerView={viewport === 'xs' ? 1.1 : viewport === 'sm' || viewport === 'md' ? 2 : 3.02}
                spaceBetween={
                  viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 11 : viewport === 'lg' ? 20 : 40
                }
                modules={[Autoplay, Lazy, Navigation]}
                className={trendingList.length > 3 ? 'auctionNavigationSwiper' : 'noScrollNavigationSwiper'}
              >
                {trendingList.map((item: any, index) => (
                  <SwiperSlide key={index}>
                    <TrendingCollectionCard
                      collectionID={item.collection_id}
                      image={item.cover_image}
                      collectionName={item.collection_name}
                      artistName={item.artist_username}
                      nftCount={item.number_in_collections}
                      avatar={item.artist_profile_picture}
                      key={index}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </div>
        )}
      </section>
    )
  )
}

export default TrendingCollectionSection
