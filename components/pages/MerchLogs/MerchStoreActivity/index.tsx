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
import GradientButton from 'components/Button/GradientButton'

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
          <div className={styles.noArtwork}>Your merch store is empty.</div>
          <div className={styles.text}>Ready to design?</div>
          <div className="w-full flex justify-center mt-[30px]">
            <GradientButton label="Get Started" width={144} height={54} borderRadius={30} onClick={() => {}} />
          </div>
        </div>
      )}
    </div>
  )
}

export default MerchStoreActivity
