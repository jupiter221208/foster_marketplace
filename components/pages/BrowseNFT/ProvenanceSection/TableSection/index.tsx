import React, { useEffect, useState } from 'react'

// third party components

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'

// components
import ProvenanceTable from 'components/Table/ProvenanceTable'
import ProvenanceAccordion from 'components/Accordion/ProvenanceAccordion'

// custom functions
import { useViewport } from 'utils'

// styles
import styles from './index.module.scss'

const TableSection = props => {
  const { data, nftUrl } = props
  const viewport = useViewport()

  return (
    <section className={styles.container}>
      {viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? (
        <ProvenanceTable data={data} nftUrl={nftUrl} />
      ) : (
        <ProvenanceAccordion data={data} />
      )}
    </section>
  )
}

export default TableSection
