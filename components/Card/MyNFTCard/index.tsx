import React from 'react'

// next components
import Image from 'next/image'

// custom components
import GradientButton from 'components/Button/GradientButton'
import OutlineButton from 'components/Button/OutlineButton'

// images and icons
import AudioPlayerBackground from 'assets/images/audio-player.png'

// styles
import styles from './index.module.scss'
import { getShortAddress } from 'utils/strings'

const MyNFTCard = props => {
  const { data, onClick, onClickStartAuction, onClickListNFT } = props

  return (
    <div className={styles.container} onClick={() => onClick(data)}>
      <div className="w-full rounded-[10px] lg:rounded-[24px] overflow-hidden max-h-[321px]">
        <img
          src={data.offchainMetadata.image === undefined || data.offchainMetadata.image === null ? AudioPlayerBackground.src : data.offchainMetadata.image}
          alt={data.offchainMetadata.name || data.name}
          className="w-full aspect-[321/321] object-cover"
        />
      </div>
      <div className="w-full mt-[10px] flex flex-wrap justify-center items-center">
        <div className="w-full flex items-center">
          <div className={styles.nftName}>{data.offchainMetadata.name || data.name}</div>
        </div>
        <div className="w-full flex items-center">
          <div className={styles.artistName}>{getShortAddress(data.creators[0].address.toString()) || 'No Artist'}</div>
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
