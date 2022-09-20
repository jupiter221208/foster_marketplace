import React from 'react'

// third party components
// swiper
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Lazy, Navigation } from 'swiper'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'

// components
import StatsMarketplaceCard from 'components/Card/StatsMarketplaceCard'

// styles
import styles from './index.module.scss'

const CollectionSection = props => {
  const { viewport, list } = props

  return (
    <section className={styles.container}>
      <div className="w-full z-10">
        <Swiper
          navigation={viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? true : false}
          centeredSlides={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? true : false}
          slidesPerView={
            viewport === 'xs' ? 1.2 : viewport === 'sm' ? 2 : viewport === 'md' ? 1.8 : viewport === '2xl' ? 3 : 2
          }
          spaceBetween={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 10 : viewport === 'xl' ? 20 : 30}
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
              <StatsMarketplaceCard index={index} data={item} viewport={viewport} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  )
}

export default CollectionSection
