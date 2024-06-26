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

const MerchStoreActivity = props => {
  const { storeList, isLoading } = props

  return (
    <div className={styles.container}>
      {storeList.length > 0 && (
        <div className="mt-[10px]">
          <TableSections data={storeList} />
        </div>
      )}

      {!isLoading && storeList?.length === 0 && (
        <div className="w-full mt-[50px] lg:mt-[0px]">
          <div className={styles.noArtwork}>{'No Merch Store Data'}</div>
        </div>
      )}
    </div>
  )
}

export default MerchStoreActivity
