import React, { useEffect, useState } from 'react'

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
              ? 1.6
              : viewport === 'sm'
              ? 2.5
              : viewport === 'md'
              ? 2.9
              : viewport === 'lg'
              ? 2.5
              : viewport === 'xl'
              ? screenWidth >= 1300
                ? 3
                : 2.8
              : viewport === '2xl'
              ? screenWidth >= 1768
                ? 4
                : 3.5
              : 4
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
              <StatsCollectionCard data={item} type="collections" />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  )
}

export default CollectionSection
