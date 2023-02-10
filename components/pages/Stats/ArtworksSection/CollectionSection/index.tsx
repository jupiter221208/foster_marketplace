import React from 'react'

// third party components
// swiper
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Lazy, Navigation } from 'swiper'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'

// components
import StatsCollectionCard from 'components/Card/StatsCollectionCard'

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
          slidesPerView={
            viewport === 'xs' || viewport === 'sm' || viewport === 'md'
              ? 1.4
              : viewport === 'lg'
              ? 5
              : viewport === 'xl'
              ? 5.5
              : viewport === '2xl'
              ? 8
              : 8
          }
          spaceBetween={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 11 : viewport === 'lg' ? 20 : 40}
          modules={[Autoplay, Lazy, Navigation]}
          className="hideNavigationSwiper"
          loop
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
        >
          {list.map((item, index) => (
            <SwiperSlide key={index}>
              <StatsCollectionCard data={item} type="artworks" />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  )
}

export default CollectionSection
