import React, { useEffect, useState } from 'react'

// third party components
// swiper
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Lazy, Navigation } from 'swiper'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'

// components
import CheckoutTable from 'components/Table/CheckoutTable'

// custom functions
import { useViewport } from 'utils'

// styles
import styles from './index.module.scss'

const TableSection = props => {
  const { data } = props
  const viewport = useViewport()

  return (
    <section className={styles.container}>
      <CheckoutTable data={data} />
    </section>
  )
}

export default TableSection
