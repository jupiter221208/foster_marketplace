import React, { useEffect, useState } from 'react'

// components
import TableSections from './TableSection'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'

// json

// functions

// styles
import styles from './index.module.scss'

const ProvenanceSection = props => {
  const { nftUrl } = props

  const [list, setList] = useState<any[]>([
    { id: '1', availability: 'Listed for 2 Sol', action: 'buy', address: '3dk3k48dl3' },
  ])

  return (
    <div className={styles.container}>
      <div className={styles.title}>Provenance</div>

      {list.length > 0 && (
        <div className="mt-[10px] lg:mt-[40px]">
          <TableSections data={list} nftUrl={nftUrl} />
        </div>
      )}
    </div>
  )
}

export default ProvenanceSection
