import React, { useEffect, useState } from 'react'

// next components
import { useRouter } from 'next/router'

// third party components
// swiper
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Lazy, Navigation } from 'swiper'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'

// components
import OutlineButton from 'components/Button/OutlineButton'
import TrendingCollectionCard from 'components/Card/TrendingCollectionCard'

// styles
import styles from './index.module.scss'

// call apis
import dashboardAPI from 'apis/dashboard'
import { useViewport } from 'utils'

const ExploreCollectionSection = props => {
  const viewport = useViewport()
  const router = useRouter()

  const [trendingList, setTrendingList] = useState<any[]>([])

  useEffect(() => {
    dashboardAPI.getTrendingCollections('').then(
      response => {
        if (response instanceof Array) {
          setTrendingList(response)
        }
      },
      error => {
        console.log(error)
      }
    )
  }, [])

  return (
    <section className={styles.container}>
      <div className={styles.topLeftEllipse} />
      <div className="w-full flex justify-between items-center z-10">
        <div className="w-full lg:w-auto flex justify-center lg:justify-start items-center gap-4 lg:gap-8">
          <div className={`${styles.title} mr-0 lg:mr-6 xl:mr-8`}>Explore the Circus</div>
        </div>
        <div className="hidden lg:flex z-10">
          <OutlineButton label="See More" onClick={() => router.push('/explore')} borderColor="#ffffff" height="42px" />
        </div>
      </div>
      <div className="w-full mt-[15px] lg:mt-[34px] z-10">
        {trendingList !== null && trendingList !== undefined && trendingList.length !== 0 && (
          <Swiper
            navigation={viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? true : false}
            slidesPerView={viewport === 'xs' ? 1.2 : viewport === 'sm' ? 2 : 3}
            spaceBetween={
              viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 11 : viewport === 'lg' ? 20 : 40
            }
            modules={[Autoplay, Lazy, Navigation]}
            className="navigationSwiper"
            loop
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
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
                />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
      <div className="w-full flex lg:hidden justify-center">
        <div className="w-full max-w-[242px] z-10">
          <OutlineButton
            label="See More"
            fullWidth
            onClick={() => router.push('/explore')}
            borderColor="#ffffff"
            height="40px"
          />
        </div>
      </div>
    </section>
  )
}

export default ExploreCollectionSection
