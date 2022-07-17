import React from 'react'

// next components
import Image from 'next/image'

// styles
import styles from './index.module.scss'
import CheckedGreenIcon from 'assets/icons/checked-green.svg'

const LiveAuctionCard = props => {
  const { image, nftName, artistName, icon, count, endsIn, viewport } = props
  return (
    <div className={styles.container}>
      <div className="w-full rounded-[10px] lg:rounded-[24px] overflow-hidden">
        <Image src={image} alt="" width={321} height={345} layout="responsive" objectFit="cover" />
      </div>
      <div className="w-full mt-[10px] flex flex-wrap justify-center items-center px-[9px]">
        <div className="w-full flex justify-between items-center">
          <div className={styles.nftName}>{nftName}</div>
        </div>
        <div className="w-full mt-[4px] flex items-center">
          <div className={styles.artistName}>{artistName}</div>
          <div className="pl-[6px]">
            <Image
              src={CheckedGreenIcon}
              alt=""
              width={viewport === 'sm' || viewport === 'md' ? 12 : 28}
              height={viewport === 'sm' || viewport === 'md' ? 12 : 28}
            />
          </div>
        </div>
      </div>
      <div className={styles.bidContainer}>
        {viewport === 'sm' || viewport === 'md' ? (
          <div className="w-full flex flex-wrap">
            <div className="w-full flex items-center">
              <div className={styles.bidName}>Current Bid :&nbsp;</div>
              <div className={styles.bidCount}>{count}</div>
              <Image
                src={icon}
                alt=""
                width={viewport === 'sm' || viewport === 'md' ? 12 : 24}
                height={viewport === 'sm' || viewport === 'md' ? 12 : 24}
              />
            </div>
            <div className="w-full flex items-center mt-1">
              <div className={styles.bidName}>Ends in :&nbsp;</div>
              <div className={styles.bidCount}>{endsIn}</div>
            </div>
          </div>
        ) : (
          <div className="w-full flex justify-between">
            <div>
              <div className={styles.bidName}>Current Bid</div>
              <div className="flex items-center">
                <div className={styles.bidCount}>{count}</div>
                <Image
                  src={icon}
                  alt=""
                  width={viewport === 'sm' || viewport === 'md' ? 12 : 24}
                  height={viewport === 'sm' || viewport === 'md' ? 12 : 24}
                />
              </div>
            </div>
            <div>
              <div className={styles.bidName}>Ends in</div>
              <div className="flex items-center">
                <div className={styles.bidCount}>{endsIn}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default LiveAuctionCard
