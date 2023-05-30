import React from 'react'

import 'swiper/css'
import 'swiper/css/navigation'

// components
import VoteHistoryTable from 'components/Table/Dao/VoteHistoryTable'
import VoteHistoryAccordion from 'components/Accordion/Dao/VoteHistoryAccordion'

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
        <VoteHistoryTable data={data} />
      ) : (
        <VoteHistoryAccordion data={data} />
      )}
    </section>
  )
}

export default TableSection
