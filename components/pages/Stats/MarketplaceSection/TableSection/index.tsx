import React from 'react'

// components
import MarketplacesTable from 'components/Table/Stats/MarketplacesTable'
import MarketplacesAccordion from 'components/Accordion/Stats/MarketplacesAccordion'

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
        <MarketplacesTable data={data} />
      ) : (
        <MarketplacesAccordion data={data} />
      )}
    </section>
  )
}

export default TableSection
