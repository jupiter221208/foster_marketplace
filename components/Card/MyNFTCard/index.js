import React from 'react'

// next components
import Image from 'next/image'

// custom components
import GradientButton from 'components/Button/GradientButton'
import OutlineButton from 'components/Button/OutlineButton'

// images and icons
import SolanaLogoIcon from 'assets/icons/solana-logo.svg'

// styles
import styles from './index.module.scss'

const MyNFTCard = props => {
  const { viewport, data, onClick } = props

  return (
    <div className={styles.container}>
      <div className="w-full rounded-[10px] lg:rounded-[24px] overflow-hidden">
        <img src={data.image} alt={data.name} className="w-full aspect-[321/378] object-cover" />
      </div>
      <div className="w-full mt-[10px] flex flex-wrap justify-center items-center">
        <div className="w-full flex items-center">
          <div className={styles.nftName}>{data.name}</div>
        </div>
        <div className="w-full flex items-center">
          <div className={styles.artistName}>{data.artist || 'No Artist'}</div>
        </div>
        <div className="w-full hidden lg:flex justify-between items-center mt-4">
          <GradientButton label="Start Auction" onClick={() => {}} height="40px" fontSize="14px" />
          <OutlineButton label="List NFT" onClick={() => onClick(data)} height="40px" fontSize="14px" />
        </div>
        <div className="w-full flex lg:hidden justify-between items-center mt-4">
          <OutlineButton label="Start Auction" onClick={() => {}} height="26px" fontSize="10px" borderRadius="6px" />
          <GradientButton
            label="List NFT"
            onClick={() => onClick(data)}
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
