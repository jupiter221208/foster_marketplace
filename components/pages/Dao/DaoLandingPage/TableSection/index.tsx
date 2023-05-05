import React, { useEffect, useState } from 'react'

import 'swiper/css'
import 'swiper/css/navigation'

// components
import LandingTable from 'components/Table/Dao/LandingTable'
import ArtworksAccordion from 'components/Accordion/Stats/ArtworksAccordion'

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
        <LandingTable data={data} />
      ) : (
        <ArtworksAccordion data={data} />
      )}
    </section>
  )
}

export default TableSection
