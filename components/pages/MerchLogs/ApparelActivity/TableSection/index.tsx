import React, { useEffect, useState } from 'react'

// third party components
// swiper
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Lazy, Navigation } from 'swiper'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'

// components
import OrdersAccordion from 'components/Accordion/Merch/OrdersAccordion'
import MerchActivityTable from 'components/Table/MerchActivityTable'

// custom functions
import { useViewport } from 'utils'

// styles
import styles from './index.module.scss'

const TableSection = props => {
  const { data, type } = props
  const viewport = useViewport()

  return (
    <section className={styles.container}>
      {viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? (
        <MerchActivityTable data={data} type={type} />
      ) : (
        <OrdersAccordion data={data} type={type} />
      )}
    </section>
  )
}

export default TableSection
