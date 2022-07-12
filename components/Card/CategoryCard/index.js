import React from 'react'

// next components
import Image from 'next/image'

// styles
import styles from './index.module.scss'

const CategoryCard = props => {
  const { image, name, nfts, collections } = props
  return (
    <div className={styles.container}>
      <Image
        src={image}
        alt=""
        width={359}
        height={450}
        layout="responsive"
        objectFit="cover"
        className="rounded-[24px]"
      />
      <div className={styles.bottomSection}>
        <div className={styles.name}>{name}</div>
        <div className="flex mt-[4px] w-full">
          <div className={styles.nftTitle}>NFTs:</div>
          <div className={`${styles.nftValue} ml-[4px]`}>{nfts}</div>
        </div>
        <div className="hidden lg:flex mt-[3px] w-full">
          <div className={styles.nftTitle}>Collections:</div>
          <div className={`${styles.nftValue} ml-[4px]`}>{collections}</div>
        </div>
      </div>
    </div>
  )
}

export default CategoryCard
