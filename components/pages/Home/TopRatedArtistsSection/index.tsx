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

// styles
import styles from './index.module.scss'
import ArrowRightGreenIcon from 'assets/icons/arrow-right-white-medium.svg?component'

// call apis
import dashboardAPI from 'apis/dashboard'
import SeeMoreButton from 'components/Button/SeeMoreButton'
import TimeSlotButton from 'components/Button/TimeSlotButton'

const TopRatedArtistsSection = () => {
  const viewport = useViewport()
  const router = useRouter()
  const dispatch = useDispatch()

  const [artistsList, setArtistsList] = useState<any[]>([])
  const [active, setActive] = useState<any>(2)
  const [isLoading, setIsLoading] = useState(false)

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
      <div className="w-full flex justify-center">
        {viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? (
          <div className="w-full flex justify-between items-center z-10">
            <div className={styles.title}>Trending Artists</div>
            <div className="flex gap-[8px] items-center">
              <div
                className={styles.seeMore}
                onClick={() => {
                  dispatch({ type: 'set', exploreTab: 2 })
                  dispatch({ type: 'set', artistSort: 'top' })
                  router.push('/explore')
                }}
              >
                See More
              </div>
              <ArrowRightGreenIcon alt="" />
            </div>
          </div>
        ) : (
          <div></div>
        )}
      </div>
      <div className="w-full flex justify-between items-center z-10">
        <div className="w-full lg:w-auto flex justify-center lg:justify-start items-center gap-4 lg:gap-8">
          <div className="w-full hidden gap-16 lg:flex h-[54px]">
            <div className={`${styles.title}`}>Trending&nbsp;Artists</div>
            <div className={styles.slotBG}>
              <TimeSlotButton
                label="24 hrs"
                onClick={() => handleChangeActive(0)}
                fontFamily={'Muli-SemiBold'}
                color={active === 0 ? '#1A1A1A' : '#979EA2'}
                backgroundColor01={active === 0 ? 'var(--toggle-bg-color)' : 'transparent'}
                backgroundColor02={active === 0 ? 'var(--toggle-bg-color)' : 'transparent'}
                gradientDirection="bottom"
                width={86}
                boxShadow={active === 0 ? '0px 0px 10px rgba(32, 36, 39, 0.15)' : ''}
              />
              <TimeSlotButton
                label="7 days"
                onClick={() => handleChangeActive(1)}
                fontFamily={'Muli-SemiBold'}
                color={active === 1 ? '#1A1A1A' : '#979EA2'}
                backgroundColor01={active === 1 ? 'var(--toggle-bg-color)' : 'transparent'}
                backgroundColor02={active === 1 ? 'var(--toggle-bg-color)' : 'transparent'}
                gradientDirection="bottom"
                width={86}
                boxShadow={active === 1 ? '0px 0px 10px rgba(32, 36, 39, 0.15)' : ''}
              />
              <TimeSlotButton
                label="30 days"
                onClick={() => handleChangeActive(2)}
                fontFamily={'Muli-SemiBold'}
                color={active === 2 ? '#1A1A1A' : '#979EA2'}
                backgroundColor01={active === 2 ? 'var(--toggle-bg-color)' : 'transparent'}
                backgroundColor02={active === 2 ? 'var(--toggle-bg-color)' : 'transparent'}
                gradientDirection="bottom"
                width={100}
                boxShadow={active === 2 ? '0px 0px 10px rgba(32, 36, 39, 0.15)' : ''}
              />
              <TimeSlotButton
                label="All Time"
                onClick={() => handleChangeActive(3)}
                fontFamily={'Muli-SemiBold'}
                color={active === 3 ? '#1A1A1A' : '#979EA2'}
                backgroundColor01={active === 3 ? 'var(--toggle-bg-color)' : 'transparent'}
                backgroundColor02={active === 3 ? 'var(--toggle-bg-color)' : 'transparent'}
                gradientDirection="bottom"
                width={100}
                boxShadow={active === 3 ? '0px 0px 10px rgba(32, 36, 39, 0.15)' : ''}
              />
            </div>
          </div>
        </div>
        <div className="hidden lg:flex z-10">
          <SeeMoreButton
            onClick={() => {
              dispatch({ type: 'set', exploreTab: 2 })
              dispatch({ type: 'set', artistSort: 'top' })
              router.push('/explore')
            }}
          />
        </div>
      </div>
      <div className="w-full block lg:hidden h-[54px] mt-[15px]">
        <div className={styles.slotBG}>
          <TimeSlotButton
            label="24 hrs"
            onClick={() => handleChangeActive(0)}
            fontFamily={'Muli-SemiBold'}
            color={active === 0 ? '#1A1A1A' : '#979EA2'}
            backgroundColor01={active === 0 ? 'var(--toggle-bg-color)' : 'transparent'}
            backgroundColor02={active === 0 ? 'var(--toggle-bg-color)' : 'transparent'}
            gradientDirection="bottom"
            width={86}
            boxShadow={active === 0 ? '0px 0px 10px rgba(32, 36, 39, 0.15)' : ''}
          />
          <TimeSlotButton
            label="7 days"
            onClick={() => handleChangeActive(1)}
            fontFamily={'Muli-SemiBold'}
            color={active === 1 ? '#1A1A1A' : '#979EA2'}
            backgroundColor01={active === 1 ? 'var(--toggle-bg-color)' : 'transparent'}
            backgroundColor02={active === 1 ? 'var(--toggle-bg-color)' : 'transparent'}
            gradientDirection="bottom"
            width={86}
            boxShadow={active === 1 ? '0px 0px 10px rgba(32, 36, 39, 0.15)' : ''}
          />
          <TimeSlotButton
            label="30 days"
            onClick={() => handleChangeActive(2)}
            fontFamily={'Muli-SemiBold'}
            color={active === 2 ? '#1A1A1A' : '#979EA2'}
            backgroundColor01={active === 2 ? 'var(--toggle-bg-color)' : 'transparent'}
            backgroundColor02={active === 2 ? 'var(--toggle-bg-color)' : 'transparent'}
            gradientDirection="bottom"
            width={86}
            boxShadow={active === 2 ? '0px 0px 10px rgba(32, 36, 39, 0.15)' : ''}
          />
          <TimeSlotButton
            label="All Time"
            onClick={() => handleChangeActive(3)}
            fontFamily={'Muli-SemiBold'}
            color={active === 3 ? '#1A1A1A' : '#979EA2'}
            backgroundColor01={active === 3 ? 'var(--toggle-bg-color)' : 'transparent'}
            backgroundColor02={active === 3 ? 'var(--toggle-bg-color)' : 'transparent'}
            gradientDirection="bottom"
            width={86}
            boxShadow={active === 3 ? '0px 0px 10px rgba(32, 36, 39, 0.15)' : ''}
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
