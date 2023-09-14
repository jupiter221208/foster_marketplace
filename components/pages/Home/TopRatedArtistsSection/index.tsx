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
import OutlineButton from 'components/Button/OutlineButton'
import ArtistCard from 'components/Card/ArtistCard'

// custom functions
import { useViewport } from 'utils'

// images and icons
import Artist from 'assets/images/dashboard-avatar.png'

// styles
import styles from './index.module.scss'

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

  useEffect(() => {
    getTopRatedArtistsFromServer('month')
  }, [])

  const getTopRatedArtistsFromServer = period => {
    dashboardAPI.getTopRatedArtists(period).then(
      response => {
        if (response !== undefined && response !== null) {
          setArtistsList(response)
        }
      },
      error => {
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
        <div className="w-full lg:w-auto flex justify-center lg:justify-start items-center gap-4 lg:gap-8">
          {viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? (
            <div className="w-full flex justify-center items-center z-10">
              <div className={styles.title}>Trending Artists</div>
            </div>
          ) : (
            <div className={`${styles.title} mr-0 lg:mr-6 xl:mr-8`}>Trending Artists</div>
          )}

          <div className="hidden lg:flex justify-between gap-[10px] lg:gap-[30px] xl:gap-[50px]">
            <TimeSlotButton
              label="24 hrs"
              onClick={() => handleChangeActive(0)}
              fontFamily={'Muli-SemiBold'}
              color={active === 0 ? 'var(--day-btn-color)' : '#979EA2'}
              backgroundColor01={active === 0 ? 'var(--day-btn-bg-1)' : 'transparent'}
              backgroundColor02={active === 0 ? 'var(--day-btn-bg-2)' : 'transparent'}
              gradientDirection="bottom"
            />
            <TimeSlotButton
              label="7 days"
              onClick={() => handleChangeActive(1)}
              fontFamily={'Muli-SemiBold'}
              color={active === 1 ? 'var(--day-btn-color)' : '#979EA2'}
              backgroundColor01={active === 1 ? 'var(--day-btn-bg-1)' : 'transparent'}
              backgroundColor02={active === 1 ? 'var(--day-btn-bg-2)' : 'transparent'}
              gradientDirection="bottom"
            />
            <TimeSlotButton
              label="30 days"
              onClick={() => handleChangeActive(2)}
              fontFamily={'Muli-SemiBold'}
              color={active === 2 ? 'var(--day-btn-color)' : '#979EA2'}
              backgroundColor01={active === 2 ? 'var(--day-btn-bg-1)' : 'transparent'}
              backgroundColor02={active === 2 ? 'var(--day-btn-bg-2)' : 'transparent'}
              gradientDirection="bottom"
            />
            <TimeSlotButton
              label="All Time"
              onClick={() => handleChangeActive(3)}
              fontFamily={'Muli-SemiBold'}
              color={active === 3 ? 'var(--day-btn-color)' : '#979EA2'}
              backgroundColor01={active === 3 ? 'var(--day-btn-bg-1)' : 'transparent'}
              backgroundColor02={active === 3 ? 'var(--day-btn-bg-2)' : 'transparent'}
              gradientDirection="bottom"
            />
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
            color={active === 0 ? 'var(--search-menu-icon-color)' : '#979EA2'}
            backgroundColor01={active === 0 ? 'var(--time-slog-bg)' : 'transparent'}
            backgroundColor02={active === 0 ? 'var(--time-slog-bg)' : 'transparent'}
            gradientDirection="bottom"
            width={86}
            boxShadow={active === 0 ? '0px 0px 10px rgba(32, 36, 39, 0.15)' : ''}
          />
          <TimeSlotButton
            label="7 days"
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
            label="30 days"
            onClick={() => handleChangeActive(2)}
            fontFamily={'Muli-SemiBold'}
            color={active === 2 ? 'var(--search-menu-icon-color)' : '#979EA2'}
            backgroundColor01={active === 2 ? 'var(--time-slog-bg)' : 'transparent'}
            backgroundColor02={active === 2 ? 'var(--time-slog-bg)' : 'transparent'}
            gradientDirection="bottom"
            width={86}
            boxShadow={active === 2 ? '0px 0px 10px rgba(32, 36, 39, 0.15)' : ''}
          />
          <TimeSlotButton
            label="All Time"
            onClick={() => handleChangeActive(3)}
            fontFamily={'Muli-SemiBold'}
            color={active === 3 ? 'var(--search-menu-icon-color)' : '#979EA2'}
            backgroundColor01={active === 3 ? 'var(--time-slog-bg)' : 'transparent'}
            backgroundColor02={active === 3 ? 'var(--time-slog-bg)' : 'transparent'}
            gradientDirection="bottom"
            width={86}
            boxShadow={active === 3 ? '0px 0px 10px rgba(32, 36, 39, 0.15)' : ''}
          />
        </div>
      </div>
      <div className="w-full mt-[30px] lg:mt-[34px] z-10">
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
          className={'navigationSwiper'}
          // loop
          // autoplay={{
          //   delay: 5000,
          //   disableOnInteraction: false,
          // }}
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
      </div>
      <div className="w-full flex lg:hidden justify-center lg:mt-0 mt-[15px]">
        <div className="w-full max-w-[242px] z-10">
          <OutlineButton
            label="See More"
            fullWidth
            onClick={() => {
              dispatch({ type: 'set', exploreTab: 2 })
              dispatch({ type: 'set', artistSort: 'top' })
              router.push('/explore')
            }}
            borderColor={'var(--see-more-border)'}
            height="40px"
          />
        </div>
      </div>
    </section>
  )
}

export default TopRatedArtistsSection
