import React from 'react'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'

// components
import CheckoutTable from 'components/Table/CheckoutTable'

// styles
import styles from './index.module.scss'

const TableSection = props => {
  const { data } = props

  return (
    <section className={styles.container}>
      <CheckoutTable data={data} />
    </section>
  )
}

export default TableSection
