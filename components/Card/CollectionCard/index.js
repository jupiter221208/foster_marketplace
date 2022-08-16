import React from 'react'

// next components
import Image from 'next/image'

// images and icons
import SolanaLogoIcon from 'assets/icons/solana-logo.svg'

// styles
import styles from './index.module.scss'
import CheckedGreenIcon from 'assets/icons/checked-green.svg'

const CollectionCard = props => {
  const { image, nftName, nftType, artistName, nfts, price, viewport } = props
  return (
    <div className={styles.container}>
      <div className="relative w-full rounded-[10px] lg:rounded-[20px] overflow-hidden">
        <Image src={image} alt="" width={321} height={378} layout="responsive" objectFit="cover" />
        <div className="absolute bottom-[14px] right-[8px]"></div>
      </div>
      <div className="w-full mt-[10px] flex flex-wrap justify-center items-center px-[9px]">
        <div className="w-full flex justify-between items-center">
          <div className={styles.nftName}>{nftName}</div>
          <div className={`${styles.priceName} mt-[4px] md:mt-[10px] lg:mt-[10px]`}>NFTs</div>
        </div>
        <div className="w-full flex justify-between items-center">
          <div className="flex justify-start items-center">
            <div className={styles.artistName}>{artistName}</div>
            <div className="ml-1 lg:ml-3 h-[11px] sm:h-[16px] md:h-[24px] flex items-center">
              <Image
                src={CheckedGreenIcon}
                alt=""
                width={
                  viewport === 'xs' ? 11 : viewport === 'sm' ? 12 : viewport === 'md' ? 13 : viewport === 'lg' ? 16 : 24
                }
                height={
                  viewport === 'xs' ? 11 : viewport === 'sm' ? 12 : viewport === 'md' ? 13 : viewport === 'lg' ? 16 : 24
                }
              />
            </div>
          </div>
          <div className={styles.price}>{nfts}</div>
        </div>
        <div className="w-full mt-[4px] flex justify-between items-center">
          <div className={styles.nftType}>{nftType}</div>
          <div className="items-center">
            <div className={styles.priceName}>Floor Price</div>
            <div className="flex justify-end items-center mt-[4px]">
              <Image
                src={SolanaLogoIcon}
                width={
                  viewport === 'xs' ? 11 : viewport === 'sm' ? 13 : viewport === 'md' ? 14 : viewport === 'lg' ? 16 : 24
                }
                height={
                  viewport === 'xs' ? 11 : viewport === 'sm' ? 13 : viewport === 'md' ? 14 : viewport === 'lg' ? 16 : 24
                }
                alt=""
              />
              <div className={`${styles.price} ml-1 lg:ml-3`}>{price}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CollectionCard
