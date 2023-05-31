import React, { useEffect, useState } from 'react'

// third party components
// swiper
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Lazy, Navigation } from 'swiper'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'

// components
import CollectionsTable from 'components/Table/Stats/CollectionsTable'
import CollectionsAccordion from 'components/Accordion/Stats/CollectionsAccordion'

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
        <CollectionsTable data={data} />
      ) : (
        <CollectionsAccordion data={data} />
      )}
    </section>
  )
}

export default TableSection
