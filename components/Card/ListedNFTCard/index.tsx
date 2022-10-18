import React from 'react'

// next components
import Image from 'next/image'

// custom components
import GradientButton from 'components/Button/GradientButton'

// custom functions
import { useViewport } from 'utils'

// images and icons
import SolanaLogoIcon from 'assets/icons/solana-logo.svg'

// styles
import styles from './index.module.scss'
import { getShortAddress, getPriceValue } from 'utils/strings'

const ListedNFTCard = props => {
  const { data, onClick, onUpdateClick } = props
  const viewport = useViewport()

  return viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? (
    <div className={styles.container}>
      <div className="w-full relative rounded-[10px] lg:rounded-[24px] overflow-hidden" onClick={() => onClick()}>
        <Image src={data.asset.json.image} alt="" width={321} height={378} layout="responsive" objectFit="cover" />
      </div>
      <div className="w-full mt-[10px] flex flex-wrap justify-center items-center">
        <div className="w-full flex items-center">
          <div className={styles.nftName}>{data.asset.json.name}</div>
        </div>
        <div className="w-full flex justify-between items-center">
          <div className={styles.artistName}>{getShortAddress(data.asset.creators[0].address.toString())}</div>
          <div className="flex items-center mt-2 gap-[6px]">
            <Image src={SolanaLogoIcon} alt="" />
            <div className={styles.nftName}>{getPriceValue(data.price.basisPoints)}</div>
          </div>
        </div>
        <div className="mt-[7px] w-full">
          <GradientButton
            label="Update"
            onClick={() => onUpdateClick(data)}
            height="48px"
            fontSize="16px"
            paddingLeft="37px"
            paddingRight="37px"
            backgroundColor01="#63D6CD"
            backgroundColor02="#326B67"
            gradientDirection="bottom"
            fullWidth
          />
        </div>
      </div>
    </div>
  ) : (
    <div className={styles.container}>
      <div className="w-full relative rounded-[10px] lg:rounded-[24px] overflow-hidden">
        <Image src={data.asset.json.image} alt="" width={321} height={378} layout="responsive" objectFit="cover" />
      </div>
      <div className="w-full mt-[10px] flex flex-wrap justify-center items-center">
        <div className="w-full flex items-center">
          <div className={styles.nftName}>{data.asset.json.name}</div>
        </div>
        <div className="w-full flex justify-between items-center">
          <div className={styles.artistName}>{getShortAddress(data.asset.creators[0].address.toString())}</div>
        </div>
        <div className="w-full flex justify-between items-center mt-2">
          <GradientButton
            label="Update"
            onClick={() => onClick(data)}
            height="26px"
            fontSize="10px"
            borderRadius="6px"
          />
          <div className="flex items-center mt-2 gap-[6px]">
            <Image src={SolanaLogoIcon} alt="" />
            <div className={styles.nftName}>{getPriceValue(data.price.basisPoints)}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ListedNFTCard
