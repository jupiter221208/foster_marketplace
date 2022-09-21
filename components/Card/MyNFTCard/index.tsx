import React from 'react'

// next components
import Image from 'next/image'

// custom components
import GradientButton from 'components/Button/GradientButton'
import OutlineButton from 'components/Button/OutlineButton'

// styles
import styles from './index.module.scss'

const MyNFTCard = props => {
  const { viewport, data, onClickStartAuction, onClickListNFT } = props

  return (
    <div className={styles.container}>
      <Image
        src={data.image}
        alt={data.name}
        width={400}
        height={400}
        objectFit="cover"
        className="rounded-[10px] lg:rounded-[24px]"
      />
      <div className="w-full mt-[10px] flex flex-wrap justify-center items-center">
        <div className="w-full flex items-center">
          <div className={styles.nftName}>{data.name}</div>
        </div>
        <div className="w-full flex items-center">
          <div className={styles.artistName}>{data.artist || 'No Artist'}</div>
        </div>
        <div className="w-full hidden lg:flex justify-between items-center mt-4">
          <GradientButton
            label="Start Auction"
            onClick={() => onClickStartAuction(data)}
            height="40px"
            fontSize="14px"
          />
          <OutlineButton label="List NFT" onClick={() => onClickListNFT(data)} height="40px" fontSize="14px" />
        </div>
        <div className="w-full flex lg:hidden justify-between items-center mt-4">
          <OutlineButton
            label="Start Auction"
            onClick={() => onClickStartAuction(data)}
            height="26px"
            fontSize="10px"
            borderRadius="6px"
          />
          <GradientButton
            label="List NFT"
            onClick={() => onClickListNFT(data)}
            height="26px"
            fontSize="10px"
            borderRadius="6px"
          />
        </div>
      </div>
    </div>
  )
}

export default MyNFTCard
