import React from 'react'

// next components
import Image from 'next/image'

// styles
import styles from './index.module.scss'
import CheckedGreenIcon from 'assets/icons/checked-green.svg'

const TrendingCollectionCard = props => {
  const { image, nftName, nftType, artistName, icon, nfts, price, viewport } = props
  return (
    <div className={styles.container}>
      <div className="relative w-full rounded-[10px] lg:rounded-[24px] overflow-hidden">
        <Image src={image} alt="" width={321} height={378} layout="responsive" objectFit="cover" />
        <div className="hidden lg:flex absolute bottom-[14px] right-[8px]">
          <Image src={CheckedGreenIcon} alt="" width={28} height={28} />
        </div>
      </div>
      <div className="w-full mt-[10px] flex flex-wrap justify-center items-center px-[9px]">
        <div className="w-full flex justify-between items-center">
          <div className={styles.nftName}>{nftName}</div>
          <div className={styles.priceName}>Total NFTs</div>
        </div>
        <div className="w-full mt-[4px] flex justify-between">
          <div className={`${styles.artistName} flex items-center`}>
            {artistName}
            <div className="flex lg:hidden ml-1">
              <Image src={CheckedGreenIcon} alt="" width={12} height={12} />
            </div>
          </div>
          <div className={styles.price}>{nfts}</div>
        </div>
        <div className="w-full mt-[4px] flex justify-between items-center">
          <div className={styles.nftType}>{nftType} </div>
          <div className="items-center">
            <div className={styles.priceName}>Floor Price</div>
            <div className="flex justify-end">
              <Image
                src={icon}
                alt=""
                width={viewport === 'sm' || viewport === 'md' ? 12 : 24}
                height={viewport === 'sm' || viewport === 'md' ? 12 : 24}
              />
              <div className={styles.price}>{price}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TrendingCollectionCard
