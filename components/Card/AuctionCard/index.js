import React from 'react'

// next components
import Image from 'next/image'

// styles
import styles from './index.module.scss'
import CheckedGreenIcon from 'assets/icons/checked-green.svg'

const AuctionCard = props => {
  const { image, nftName, artistName, icon, nfts, count } = props
  return (
    <div className={styles.container}>
      <div className="w-full rounded-[24px] overflow-hidden">
        <Image src={image} alt="" layout="responsive" objectFit="cover" />
      </div>
      <div className="w-full mt-[10px] flex flex-wrap justify-center items-center px-[9px]">
        <div className="w-full flex justify-between items-center">
          <div className={styles.nftName}>{nftName}</div>
        </div>
        <div className="w-full mt-[4px] flex">
          <div className={styles.artistName}>{artistName}</div>
          <div className="pl-[6px]">
            <Image src={CheckedGreenIcon} alt="" />
          </div>
        </div>
      </div>
      <div className={styles.bidContainer}>
        <div className="w-full flex justify-between px-[28px] pt-[13px]">
          <div>
            <div className={styles.bidName}>Current Bid</div>
            <div className="flex items-center">
              <div className={styles.bidCount}>{count}</div>
              <Image src={icon} alt="" />
            </div>
          </div>
          <div>
            <div className={styles.bidName}>Ends in</div>
            <div className="flex items-center">
              <div className={styles.bidCount}>2d 6h 18m</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuctionCard
