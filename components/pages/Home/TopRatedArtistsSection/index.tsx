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

const TopRatedArtistsSection = () => {
  const viewport = useViewport()
  const router = useRouter()
  const dispatch = useDispatch()

  const [artistsList, setArtistsList] = useState<any[]>([])

  useEffect(() => {
    dashboardAPI.getTopRatedArtists().then(
      response => {
        if (response !== undefined && response !== null) {
          setArtistsList(response)
        }
      },
      error => {
        console.log(error)
      }
    )
  }, [])

  return (
    <section className={styles.container}>
      <div className="w-full flex justify-between items-center z-10">
        <div className="w-full lg:w-auto flex justify-center lg:justify-start items-center gap-4 lg:gap-8">
          {viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? (
            <div className="w-full flex justify-center items-center z-10">
              <div className={styles.title}>Top Rated Artists</div>
            </div>
          ) : (
            <div className={`${styles.title} mr-0 lg:mr-6 xl:mr-8`}>Top Rated Artists</div>
          )}
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
          className={'navigationSwiper'}
          loop
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
