import React from 'react'

import 'swiper/css'
import 'swiper/css/navigation'

// components
import LandingTable from 'components/Table/Dao/LandingTable'
import DaoLandingAccordion from 'components/Accordion/DaoLandingAccordion'

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
        <DaoLandingAccordion data={data} />
      )}
    </section>
  )
}

export default TableSection
