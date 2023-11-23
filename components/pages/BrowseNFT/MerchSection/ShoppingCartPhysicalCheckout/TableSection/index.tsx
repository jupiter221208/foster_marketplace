import React from 'react'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'

// components
import ShoppingCartCheckoutTable from 'components/Table/ShoppingCartCheckoutTable'

// styles
import styles from './index.module.scss'

const TableSection = props => {
  const { data } = props

  return (
    <section className={styles.container}>
      <ShoppingCartCheckoutTable data={data} />
    </section>
  )
}

export default TableSection
