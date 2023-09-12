import React from 'react'

// third party components

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'

// components
import NftItemAccordion from 'components/Accordion/Merch/NftItemAccordion'

// styles
import styles from './index.module.scss'
import MerchNftTable from 'components/Table/MerchNftTable'

const TableSection = props => {
  const { data, type, action, actionAll } = props

  return (
    <section className={styles.container}>
      <div className="hidden lg:block">
        <MerchNftTable data={data} type={type} action={action} actionAll={actionAll} />
      </div>
      <div className="block lg:hidden">
        <NftItemAccordion data={data} type={type} action={action} actionAll={actionAll} />
      </div>
    </section>
  )
}

export default TableSection
