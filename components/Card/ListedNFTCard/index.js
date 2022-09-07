import React from 'react'

// next components
import Image from 'next/image'

// custom components
import GradientButton from 'components/Button/GradientButton'

// images and icons
import SolanaLogoIcon from 'assets/icons/solana-logo.svg'

// styles
import styles from './index.module.scss'

const ListedNFTCard = props => {
  const { viewport, data, onClick } = props

  return (
    <div className={styles.container}>
      <div className="w-full relative rounded-[10px] lg:rounded-[24px] overflow-hidden">
        <Image src={data.image} alt="" width={321} height={378} layout="responsive" objectFit="cover" />
        <div className="w-full hidden lg:flex absolute bottom-2 left-2">
          <GradientButton
            label="Update"
            onClick={() => onClick(data)}
            height="48px"
            fontSize="16px"
            paddingLeft="37px"
            paddingRight="37px"
            backgroundColor01="#63D6CD"
            backgroundColor02="#326B67"
            gradientDirection="bottom"
          />
        </div>
      </div>
      <div className="w-full mt-[10px] flex flex-wrap justify-center items-center">
        <div className="w-full flex items-center">
          <div className={styles.nftName}>{data.nftName}</div>
        </div>
        <div className="w-full flex justify-between items-center mt-2">
          <div className={styles.artistName}>{data.artistName}</div>
          <div className="flex items-center gap-[6px]">
            <div className={styles.nftName}>{data.price}</div>
            <Image src={SolanaLogoIcon} alt="" />
          </div>
        </div>
        <div className="w-full flex lg:hidden justify-between items-center mt-4">
          <GradientButton label="Update" onClick={() => onClick(data)} height="26px" fontSize="10px" />
        </div>
      </div>
    </div>
  )
}

export default ListedNFTCard
