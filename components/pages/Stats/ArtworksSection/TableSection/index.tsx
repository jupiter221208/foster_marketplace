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
import OrdersAccordion from 'components/Accordion/Merch/OrdersAccordion'

// custom functions
import { useViewport } from 'utils'

// styles
import styles from './index.module.scss'

const TableSection = props => {
  const { data } = props
  const viewport = useViewport()

  return (
    <section className={styles.container}>
      {viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? (
        <ArtworksTable data={data} />
      ) : (
        <OrdersAccordion data={data} />
      )}
    </section>
  )
}

export default TableSection
