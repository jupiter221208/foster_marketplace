import React, { useEffect, useState } from 'react'

// third party components
// swiper
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Lazy, Navigation } from 'swiper'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'

// components
import ArtworksTable from 'components/Table/Stats/ArtworksTable'
import ArtworksAccordion from 'components/Accordion/Stats/ArtworksAccordion'

// styles
import styles from './index.module.scss'

const TableSection = props => {
  const { viewport, data } = props

  const [list, setList] = useState<any[]>([])

  useEffect(() => {
    let newList: any[] = []
    let tempItem: any[] = []
    data.map((item, index) => {
      tempItem.push(item)
      if (index % 10 === 9) {
        newList.push(tempItem)
        tempItem = []
      }
    })
    if (tempItem.length > 0) newList.push(tempItem)
    setList(newList.reverse())
  }, [data])

  return (
    <section className={styles.container}>
      <Swiper
        navigation={viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? true : false}
        centeredSlides={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? true : false}
        slidesPerView={1}
        spaceBetween={4}
        modules={[Autoplay, Lazy, Navigation]}
        className="showNavigationSwiper"
        loop
      >
        {viewport === 'lg' || viewport === 'xl' || viewport === '2xl'
          ? list.length !== 0 &&
            list.map((item, index) => (
              <SwiperSlide key={index}>
                <ArtworksTable viewport={viewport} data={item} />
              </SwiperSlide>
            ))
          : list.length !== 0 &&
            list.map((item, index) => (
              <SwiperSlide key={index}>
                <ArtworksAccordion data={item} />
              </SwiperSlide>
            ))}
      </Swiper>
    </section>
  )
}

export default TableSection
