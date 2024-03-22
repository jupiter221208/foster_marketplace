import React, { useEffect, useState } from 'react'

// next components
import { useRouter } from 'next/router'

// third party components
import { useDispatch } from 'react-redux'
import Lottie from 'lottie-react'
import PreLoaderIcon from 'assets/lottery/preloader.json'

// swiper
import { Swiper, SwiperSlide } from 'swiper/react'
import { EffectFade, Navigation, Pagination } from 'swiper'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'

// custom functions
import { useViewport } from 'utils'

// images and icons
import DayList from 'assets/json/home/day-list.json'

// styles
import styles from './index.module.scss'

// call apis
import dashboardAPI from 'apis/dashboard'
import SeeMoreButton from 'components/Button/SeeMoreButton'
import HomeFilterMenu from 'components/Menu/HomeFilterMenu'
import TrendingArtistCard from 'components/Card/TrendingArtistCard'

const TopRatedArtistsSection = () => {
  const viewport = useViewport()
  const router = useRouter()
  const dispatch = useDispatch()

  const [artistsList, setArtistsList] = useState<any[]>([])
  const [active, setActive] = useState<any>(2)
  const [isLoading, setIsLoading] = useState(false)
  const [period, setPeriod] = useState(DayList[2])

  useEffect(() => {
    getTopRatedArtistsFromServer('month')
  }, [])

  const getTopRatedArtistsFromServer = period => {
    setIsLoading(true)
    dashboardAPI.getTopRatedArtists(period).then(
      response => {
        setIsLoading(false)
        if (response !== undefined && response !== null) {
          setArtistsList(response)
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
        getTopRatedArtistsFromServer('day')
        break
      case 1:
        getTopRatedArtistsFromServer('week')
        break
      case 2:
        getTopRatedArtistsFromServer('month')
        break
      case 3:
        getTopRatedArtistsFromServer('all')
        break
      default:
        getTopRatedArtistsFromServer('week')
        break
    }
  }

  return (
    <section className={styles.container}>
      <div className="w-full flex justify-between items-center z-10 ">
        <div className="lg:block hidden">
          <HomeFilterMenu
            label="Trending Artists"
            data={DayList}
            selectedItem={period}
            setSelectedItem={item => {
              setPeriod(item)
              handleChangeActive(item.id)
            }}
          />
        </div>
        <div className="lg:hidden w-full flex justify-between items-center g-container">
          <div className={styles.title}>Trending&nbsp;Artists</div>
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
        <div className="lg:block hidden">
          <SeeMoreButton
            onClick={() => {
              dispatch({ type: 'set', exploreTab: 2 })
              dispatch({ type: 'set', artistSort: 'top' })
              router.push('/explore')
            }}
          />
        </div>
      </div>
      <div className="w-full mt-[30px] lg:mt-[34px] z-10">
        {isLoading ? (
          <div className="w-full h-[305px] flex justify-center">
            <div className="w-[500px] h-[40px]">
              <Lottie width={500} height={40} animationData={PreLoaderIcon} loop={true} />
            </div>
          </div>
        ) : viewport === 'xs' ? (
          <div className="w-full relative" id="trendArtistMobile">
            <Swiper
              spaceBetween={20}
              pagination={{
                clickable: true,
              }}
              modules={[Navigation, Pagination]}
              className={'trendArtistMobile'}
              loop
            >
              {artistsList.length !== 0 &&
                artistsList.map((item: any, index) => (
                  <SwiperSlide key={index}>
                    <TrendingArtistCard
                      artist={item}
                      onClick={() => {
                        dispatch({ type: 'set', isLoading: true })
                        router.push('/' + item.username)
                      }}
                      key={index}
                    />
                  </SwiperSlide>
                ))}
            </Swiper>
          </div>
        ) : (
          <div className="w-full grid grid-cols-12 gap-[20px]">
            {artistsList.map((item, index) => (
              <div key={index} className="flex col-span-12 lg:col-span-6">
                <TrendingArtistCard
                  artist={item}
                  onClick={() => {
                    dispatch({ type: 'set', isLoading: true })
                    router.push('/' + item.username)
                  }}
                  key={index}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default TopRatedArtistsSection
