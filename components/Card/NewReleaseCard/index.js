import React from 'react'

// next components
import Image from 'next/image'

// styles
import styles from './index.module.scss'

const NewReleaseCard = props => {
  const { image, nftName, artistName, icon, price } = props
  return (
    <div className={styles.container}>
      <div className="w-full rounded-[24px] overflow-hidden">
        <Image src={image} alt="" layout="responsive" objectFit="cover" />
      </div>
      <div className="w-full mt-[10px] flex flex-wrap justify-center items-center px-[9px]">
        <div className="w-full flex justify-between items-center">
          <div className={styles.nftName}>{nftName}</div>
          <div className={styles.artistName}>Price</div>
        </div>
        <div className="w-full flex justify-between items-center">
          <div className={styles.artistName}>{artistName}</div>
          <div className="flex justify-center items-center">
            <Image src={icon} alt="" />
            <div className={styles.price}>{price}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewReleaseCard
