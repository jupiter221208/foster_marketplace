import React from 'react'

// third party components
// swiper
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Lazy, Navigation } from 'swiper'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'

// components
import StatsArtistCard from 'components/Card/StatsArtistCard'

// custom functions
import { useViewport } from 'utils'

// styles
import styles from './index.module.scss'

const CollectionSection = props => {
  const { list } = props
  const viewport = useViewport()

  return (
    <section className={styles.container}>
      <div className="w-full z-10">
        <Swiper
          navigation={viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? true : false}
          centeredSlides={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? true : false}
          slidesPerView={
            viewport === 'xs'
              ? 2
              : viewport === 'sm'
              ? 2.5
              : viewport === 'md'
              ? 3
              : viewport === 'lg'
              ? 5
              : viewport === 'xl'
              ? 6
              : 8
          }
          spaceBetween={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 11 : viewport === 'lg' ? 20 : 32}
          modules={[Autoplay, Lazy, Navigation]}
          className="navigationSwiper"
          loop
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
        >
          {list.map((item, index) => (
            <SwiperSlide key={index}>
              <StatsArtistCard data={item} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  )
}

export default CollectionSection
