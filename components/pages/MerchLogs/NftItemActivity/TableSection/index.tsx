import React, { useEffect, useState } from 'react'

// third party components

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'

// components
import OrdersAccordion from 'components/Accordion/Merch/OrdersAccordion'

// custom functions
import { useViewport } from 'utils'

// styles
import styles from './index.module.scss'
import MerchNftTable from 'components/Table/MerchNftTable'

const TableSection = props => {
  const { data, type, action } = props
  const viewport = useViewport()

  return (
    <section className={styles.container}>
      {viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? (
        <MerchNftTable data={data} type={type} action={action} />
      ) : (
        <OrdersAccordion data={data} type={type} />
      )}
    </section>
  )
}

export default TableSection
