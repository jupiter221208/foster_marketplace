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
import ArtistCard from 'components/Card/ArtistCard'

// custom functions
import { useViewport } from 'utils'

// images and icons
import Artist from 'assets/images/dashboard-avatar.png'
import DayList from 'assets/json/home/day-list.json'

// styles
import styles from './index.module.scss'

// call apis
import dashboardAPI from 'apis/dashboard'
import SeeMoreButton from 'components/Button/SeeMoreButton'
import HomeFilterMenu from 'components/Menu/HomeFilterMenu'

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
      <div className="w-full flex justify-between items-center z-10">
        <div>
          <div className={`${styles.title}`}>Trending&nbsp;Artists</div>
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
        ) : (
          <Swiper
            navigation={viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? true : false}
            slidesPerView={
              viewport === 'xs'
                ? 2
                : viewport === 'sm'
                ? 2.5
                : viewport === 'md'
                ? 3
                : viewport === 'lg'
                ? 3
                : viewport === 'xl'
                ? 4
                : 5
            }
            spaceBetween={
              viewport === 'xs' || viewport === 'sm' || viewport === 'md'
                ? 16
                : viewport === 'lg'
                ? 20
                : viewport === 'xl'
                ? 24
                : 24
            }
            initialSlide={5}
            modules={[Autoplay, Lazy, Navigation]}
            className={artistsList.length > 5 ? 'artistNavigationSwiper' : 'noScrollNavigationSwiper'}
          >
            {artistsList.length !== 0 &&
              artistsList.map((item: any, index) => (
                <SwiperSlide key={index}>
                  <ArtistCard
                    image={
                      item.profile_picture !== null && item.profile_picture !== undefined && item.profile_picture !== ''
                        ? item.profile_picture
                        : Artist.src
                    }
                    username={item.username}
                    onClick={() => {
                      dispatch({ type: 'set', isLoading: true })
                      router.push('/' + item.username)
                    }}
                    key={index}
                  />
                </SwiperSlide>
              ))}
          </Swiper>
        )}
      </div>
    </section>
  )
}

export default TopRatedArtistsSection
