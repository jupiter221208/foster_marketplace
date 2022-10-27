import React from 'react'

// next components
import Image from 'next/image'

// custom functions
import { useViewport } from 'utils'

// images and icons
import SolanaLogoIcon from 'assets/icons/solana-logo.svg'

// styles
import styles from './index.module.scss'

const DashboardNFTCard = props => {
  const { image, nftName, artistName, price, onClick } = props
  const viewport = useViewport()

  return (
    <div className={styles.container} onClick={() => onClick()}>
      <div className={styles.imageArea}>
        <div className={styles.imageContent}>
          <img
            src={image !== '' ? image : '/images/most-popular-4.png'}
            alt=""
            className="w-full h-full rounded-[10px] lg:rounded-[24px] object-contain"
          />
        </div>
      </div>
      <div className="w-full mt-[10px] flex flex-wrap justify-center items-center px-[9px]">
        <div className="w-full flex items-center">
          <div className={styles.nftName}>{nftName}</div>
        </div>
        <div className="w-full flex justify-between items-center mt-[2px]">
          <div className={styles.artistName}>{artistName !== undefined && artistName}</div>
          {price && (
            <div className="flex justify-center items-center">
              <Image
                src={SolanaLogoIcon}
                alt=""
                width={viewport === 'xs' ? 15 : viewport === 'sm' || viewport === 'md' ? 18 : 23}
                height={viewport === 'xs' ? 15 : viewport === 'sm' || viewport === 'md' ? 18 : 23}
              />
              <div className={styles.price}>{price}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DashboardNFTCard
