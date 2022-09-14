import React from 'react'

// components
import ArtworksTable from 'components/Table/Stats/ArtworksTable'
import ArtworksAccordion from 'components/Accordion/Stats/ArtworksAccordion'

// styles
import styles from './index.module.scss'

const TableSection = props => {
  const { viewport, data } = props
  return (
    <section className={styles.container}>
      {viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? (
        <ArtworksAccordion data={data} />
      ) : (
        <ArtworksTable viewport={viewport} data={data} />
      )}
    </section>
  )
}

export default TableSection
