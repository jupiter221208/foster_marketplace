import React from 'react'

// next components
import Image from 'next/image'

import GreenGradientButton from 'components/Button/GradientButton'

// images and icons
import SolanaLogoIcon from 'assets/icons/solana-logo.svg'

// styles
import styles from './index.module.scss'

const NFTCard = props => {
  const { viewport, image, nftName, artistName, price, showCount = true, onClick } = props

  return (
    <div className={styles.container} onClick={() => onClick()}>
      <div className="w-full rounded-[10px] lg:rounded-[24px] overflow-hidden">
        <Image src={image} alt="" width={321} height={321} layout="responsive" objectFit="cover" />
      </div>
      <div className="w-full mt-[10px] flex flex-wrap justify-center items-center px-[9px]">
        <div className="w-full flex items-center">
          <div className={styles.nftName}>{nftName}</div>
        </div>
        <div className="w-full flex justify-between items-center">
          <div className={styles.artistName}>{artistName}</div>
        </div>
        <div className="w-full flex xs:mt-[9px] mt-[16px] justify-between items-center">
          <div className="justify-center">
            <div className={styles.nftCount}>3</div>
            <div className={styles.nftCountItems}>Items</div>
          </div>
          <div>
            <GreenGradientButton
              label="View Items"
              width={viewport === 'xs' ? 58 : 116}
              height={viewport === 'xs' ? 26 : 40}
              borderRadius={viewport === 'xs' ? 6 : 10}
              fontSize={viewport === 'xs' ? 10 : 14}
              onClick={() => {}}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default NFTCard
