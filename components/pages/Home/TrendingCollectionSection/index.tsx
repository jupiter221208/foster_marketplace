import React, { useEffect, useState } from 'react'

// next components
import { useRouter } from 'next/router'

// third party components
import { useDispatch } from 'react-redux'
import Lottie from 'lottie-react'
import PreLoaderIcon from 'assets/lottery/preloader.json'

// swiper
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Lazy, Navigation, Pagination } from 'swiper'
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

// call apis
import dashboardAPI from 'apis/dashboard'
import SeeMoreButton from 'components/Button/SeeMoreButton'
import TimeSlotButton from 'components/Button/TimeSlotButton'
import { DashboardAPIData } from 'types/nft'
import HomeFilterMenu from 'components/Menu/HomeFilterMenu'
import OutlineButton from 'components/Button/OutlineButton'
import TopCollectionCard from 'components/Card/TopCollectionCard'

const TrendingCollectionSection = props => {
  const { category, loop } = props
  const viewport = useViewport()
  const router = useRouter()
  const dispatch = useDispatch()
  const [trendingList, setTrendingList] = useState<DashboardAPIData[]>([])
  const [active, setActive] = useState<any>(1)
  const [isLoading, setIsLoading] = useState(false)
  const [period, setPeriod] = useState(DayList[3])

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
    getTrendingCollectionsFromServer(category, 'all')
  }, [category])

  const getTrendingCollectionsFromServer = (category, period) => {
    setIsLoading(true)
    dashboardAPI.getTrendingCollections(category, period).then(
      response => {
        setIsLoading(false)
        if (response instanceof Array) {
          setTrendingList(response.slice(0, 20))
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
        <div className="relative w-full flex justify-between items-center z-10">
          <div className={styles.line} />

          {/* <div className="sm:block hidden">
            <HomeFilterMenu
              label="Trending Collections"
              data={DayList}
              selectedItem={period}
              setSelectedItem={item => {
                setPeriod(item)
                handleChangeActive(item.id)
              }}
            />
          </div> */}
          <div className="sm:block hidden">
            <div className={styles.title}>Top&nbsp;Collections</div>
          </div>

          <div className="sm:hidden w-full flex justify-between items-center">
            <div className={styles.title}>Top&nbsp;Collections</div>
            <HomeFilterMenu
              label=""
              data={DayList}
              selectedItem={period}
              setSelectedItem={item => {
                setPeriod(item)
                handleChangeActive(item.id)
              }}
            />
          </div>
          <div className="sm:block hidden">
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
          <div className="mt-[20px] sm:mt-[30px] w-full grid sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 grid-cols-1 gap gap-[11px] lg:gap-[20px] xl:gap-[20px] 2xl:gap-[45px]">
            {trendingList?.map((item: any, index) => (
              <div key={index}>
                <TopCollectionCard
                  collectionID={item.collection_id}
                  image={item.cover_image}
                  collectionName={item.collection_name}
                  artistName={item.artist_username}
                  nftCount={item.number_in_collections}
                  avatar={item.artist_profile_picture}
                  rank={index + 1}
                />
              </div>
            ))}
          </div>
        )}
        <div className="w-full flex sm:hidden justify-center lg:mt-0 mt-[20px]">
          <div className="w-full max-w-[300px] z-10">
            <OutlineButton
              label="See More"
              fullWidth
              onClick={() => {
                dispatch({ type: 'set', exploreTab: 1 })
                dispatch({ type: 'set', collectionSort: 'trending' })
                dispatch({ type: 'set', collectionCategory: category })
                router.push('/explore')
              }}
              fontSize="16px"
              height="41px"
              borderRadius="8px"
            />
          </div>
        </div>
      </section>
    )
  )
}

export default TrendingCollectionSection
