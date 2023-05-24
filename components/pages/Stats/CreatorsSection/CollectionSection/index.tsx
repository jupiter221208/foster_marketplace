import React, { useState, useEffect } from 'react'

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
  const [screenWidth, setScreenWidth] = useState(1920)

  useEffect(() => {
    setScreenWidth(window.innerWidth)
  }, [])

  useEffect(() => {
    const resizeFunction = () => {
      setScreenWidth(window.innerWidth)
    }
    window.addEventListener('resize', resizeFunction)
  }, [])

  return (
    <section className={styles.container}>
      <div className="w-full z-10">
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
              ? screenWidth >= 1400
                ? 4
                : 3.7
              : viewport === '2xl'
              ? screenWidth >= 1768
                ? 5
                : 4
              : 3
          }
          spaceBetween={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 20 : viewport === 'lg' ? 20 : 32}
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
              <StatsArtistCard data={item} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  )
}

export default CollectionSection
