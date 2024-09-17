import React from 'react'

// components
import TableSections from './TableSection'

// json

// functions

// styles
import styles from './index.module.scss'

const NftItemActivity = props => {
  const { activities, type, isLoading, action, actionAll } = props
  return (
    <div className={styles.container}>
      {activities.length > 0 && (
        <div className="w-full mt-[10px]">
          <TableSections data={activities} type={type} action={action} actionAll={actionAll} />
        </div>
      )}
      {!isLoading && activities.length === 0 && (
        <div className="w-full mt-[50px] lg:mt-[50px]">
          <div className={styles.noArtwork}>
            {type ? 'No active Studio NFTs detected' : 'No Eligible Artworks Detected'}
          </div>
          <div className={styles.text}>
            {type
              ? 'Click the eligible tab and select the artworks you wish to enable for Studio 1.0.'
              : 'To be eligible for the studio, you must be both the creator and the owner of the NFT.'}
          </div>
        </div>
      )}
    </div>
  )
}

export default NftItemActivity
