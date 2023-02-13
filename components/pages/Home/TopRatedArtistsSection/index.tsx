import React, { useEffect, useState } from 'react'

// next components
import { useRouter } from 'next/router'

// third party components
import { useDispatch, useSelector } from 'react-redux'

// swiper
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Lazy, Navigation } from 'swiper'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'

// components
import Button from 'components/Button'
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

const TopRatedArtistsSection = () => {
  const viewport = useViewport()
  const router = useRouter()
  const dispatch = useDispatch()

  const [allArtistsList, setAllArtistsList] = useState<any[]>([])
  const [artistsList, setArtistsList] = useState<any[]>([])

  const [active, setActive] = useState<any>(0)

  useEffect(() => {
    dashboardAPI.getTopRatedArtists().then(
      response => {
        if (response !== undefined && response !== null) {
          setAllArtistsList(response)
          setArtistsList(response)
        }
      },
      error => {
        console.log(error)
      }
    )
  }, [])

  const handleChangeActive = value => {
    setActive(value)

    switch (value) {
      case 0:
        setArtistsList(allArtistsList.slice(0, 5))
        break
      case 1:
        setArtistsList(allArtistsList.slice(0, 10))
        break
      case 2:
        setArtistsList(allArtistsList.slice(0, 15))
        break
      default:
        setArtistsList(allArtistsList)
        break
    }
  }

  const lightMode = useSelector(state => (state as any).lightMode)

  return (
    <section className={styles.container}>
      <div className="w-full flex justify-between items-center z-10">
        <div className="w-full lg:w-auto flex justify-center lg:justify-start items-center gap-4 lg:gap-8">
          {viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? (
            <div className="w-full flex justify-center items-center z-10">
              <div className={`${styles.title} ${lightMode ? styles.lightTitle : ''}`}>Top Rated Artists</div>
            </div>
          ) : (
            <div className={`${styles.title} ${lightMode ? styles.lightTitle : ''} mr-0 lg:mr-6 xl:mr-8`}>
              Top Rated Artists
            </div>
          )}
        </div>
        <div className="hidden lg:flex z-10">
          <OutlineButton
            label="See More"
            onClick={() => {
              dispatch({ type: 'set', exploreTab: 2 })
              router.push('/explore')
            }}
            borderColor={lightMode ? '#202427' : '#ffffff'}
            height="42px"
          />
        </div>
      </div>
      <div className="w-full mt-[15px] lg:mt-[34px] z-10">
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
          modules={[Autoplay, Lazy, Navigation]}
          className="navigationSwiper"
          loop
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
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
                    router.push('/artist-profile?id=' + item.wallet_id)
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
              dispatch({ type: 'set', exploreTab: 2 })
              router.push('/explore')
            }}
            borderColor="#ffffff"
            height="40px"
          />
        </div>
      </div>
    </section>
  )
}

export default TopRatedArtistsSection
