import React, { useEffect, useState } from 'react'

// third party components
// swiper
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Lazy, Navigation } from 'swiper'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'

// components
import MerchStoreTable from 'components/Table/MerchStoreTable'

// custom functions
import { useViewport } from 'utils'

// styles
import styles from './index.module.scss'
import StoreAccordion from 'components/Accordion/Merch/StoreAccordion'

const TableSection = props => {
  const { data, onUpdate, onDelist, onCancel } = props
  const viewport = useViewport()

  return (
    <section className={styles.container}>
      {viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? (
        <MerchStoreTable data={data} onUpdate={onUpdate} onDelist={onDelist} onCancel={onCancel} />
      ) : (
        <StoreAccordion data={data} onUpdate={onUpdate} onDelist={onDelist} onCancel={onCancel} />
      )}
    </section>
  )
}

export default TableSection
