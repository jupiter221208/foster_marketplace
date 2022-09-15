import React from 'react'

// components
import MarketplacesTable from 'components/Table/Stats/MarketplacesTable'
import MarketplacesAccordion from 'components/Accordion/Stats/MarketplacesAccordion'

// styles
import styles from './index.module.scss'

const TableSection = props => {
  const { viewport, data } = props

  return (
    <section className={styles.container}>
      {viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? (
        <MarketplacesTable viewport={viewport} data={data} />
      ) : (
        <MarketplacesAccordion data={data} />
      )}
    </section>
  )
}

export default TableSection
