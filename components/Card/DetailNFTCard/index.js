import React from 'react'

// next components
import Image from 'next/image'

// styles
import styles from './index.module.scss'

const DetailNFTCard = props => {
  const { viewport, image, nftName, artistName, onClick } = props

  return (
    <div className={styles.container} onClick={() => onClick()}>
      <div className="w-full rounded-[10px] lg:rounded-[24px] overflow-hidden">
        <Image src={image} alt="" width={321} height={378} layout="responsive" objectFit="cover" />
      </div>
      <div className="w-full mt-[10px] flex flex-wrap justify-center items-center px-[9px]">
        <div className="w-full flex items-center">
          <div className={styles.nftName}>{nftName}</div>
        </div>
        <div className="w-full flex justify-between items-center">
          <div className={styles.artistName}>{artistName}</div>
        </div>
      </div>
    </div>
  )
}

export default DetailNFTCard
