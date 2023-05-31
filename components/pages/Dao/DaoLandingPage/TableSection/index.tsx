import React from 'react'

import 'swiper/css'
import 'swiper/css/navigation'

// components
import LandingTable from 'components/Table/Dao/LandingTable'
import LandingAccordion from 'components/Accordion/Dao/LandingAccordion'

// custom functions
import { useViewport } from 'utils'

// styles
import styles from './index.module.scss'

const TableSection = props => {
  const { data, onDetail } = props
  const viewport = useViewport()

  return (
    <section className={styles.container}>
      {viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? (
        <LandingTable data={data} onDetail={onDetail} />
      ) : (
        <LandingAccordion data={data} onDetail={onDetail} />
      )}
    </section>
  )
}

export default TableSection
