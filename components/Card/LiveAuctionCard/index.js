import React from 'react'

// next components
import Image from 'next/image'

// images and icons
import SolanaLogoIcon from 'assets/icons/solana-logo.svg'

// styles
import styles from './index.module.scss'
import CheckedGreenIcon from 'assets/icons/checked-green.svg'

const LiveAuctionCard = props => {
  const { image, nftName, artistName, count, endsIn, viewport } = props
  return (
    <div className={styles.container}>
      <div className="w-full rounded-[10px] lg:rounded-[24px] overflow-hidden">
        <Image src={image} alt="" width={321} height={345} layout="responsive" objectFit="cover" />
      </div>
      <div className="w-full mt-[10px] flex flex-wrap justify-center items-center px-[9px]">
        <div className="w-full flex justify-between items-center">
          <div className={styles.nftName}>{nftName}</div>
        </div>
        <div className="w-full flex items-center mt-[2px] lg:mt-[4px]">
          <div className={styles.artistName}>{artistName}</div>
          <div className="pl-[6px] flex items-center">
            <Image
              src={CheckedGreenIcon}
              alt=""
              width={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 12 : 22}
              height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 12 : 22}
            />
          </div>
        </div>
      </div>
      <div className={styles.bidContainer}>
        <div className="w-full flex flex-wrap justify-between">
          <div>
            <div className={styles.bidName}>Current Bid</div>
            <div className="flex justify-start mt-[4px] lg:mt-[6px]">
              <Image
                src={SolanaLogoIcon}
                alt=""
                width={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 12 : 23}
                height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 12 : 23}
              />
              <div className={styles.bidCount}>{count}</div>
            </div>
          </div>

          <div className="mt-[0px] lg:mt-[0px]">
            <div className={styles.endsIn}>Ends in</div>
            <div className={styles.endTime}>{endsIn}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LiveAuctionCard
