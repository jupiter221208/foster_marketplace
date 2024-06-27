import React, { useState } from 'react'

// components
import TableSections from './TableSection'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'

// json

// functions

// styles
import styles from './index.module.scss'

const NftItemActivity = props => {
  const { activities, type, isLoading, action, actionAll } = props

  const [searchWord, setSearchWord] = useState<any>('')
  const [list, setList] = useState<any[]>([])

  return (
    <div className={styles.container}>
      {activities.length > 0 && (
        <div className="w-full mt-[10px]">
          <TableSections data={activities} type={type} action={action} actionAll={actionAll} />
        </div>
      )}
      {!isLoading && activities.length === 0 && searchWord.length === 0 && (
        <div className="w-full mt-[50px] lg:mt-[50px]">
          <div className={styles.noArtwork}>No Eligible Artworks Detected</div>
          <div className={styles.text}>
            To be eligible for the studio, you must be both the creator and the owner of the NFT.
          </div>
        </div>
      )}
    </div>
  )
}

export default NftItemActivity
