import React, { useState } from 'react'

// next components
import Image from 'next/image'

// custom components
import GradientButton from 'components/Button/GradientButton'
import SmallCategoryChip from 'components/Chip/SmallCategoryChip'

// custom functions
import { getShortAddress } from 'utils/strings'

// images and icons
import SolanaLogoIcon from 'assets/icons/solana-logo.svg'

// styles
import styles from './index.module.scss'

const UpdateCollectionCard = props => {
  const { image, nftName, category, artistName, mintAddress = '', price, viewport } = props

  const [mouseOver, setMouseOver] = useState<boolean>(false)
  let onClick = () => {} // TODO: Remove

  return (
    <div className={styles.container} onMouseOver={() => setMouseOver(true)} onMouseLeave={() => setMouseOver(false)}>
      <div className="relative w-full rounded-[10px] lg:rounded-[20px] overflow-hidden">
        <Image src={image} alt="" width={321} height={378} layout="responsive" objectFit="cover" />
        <div className="absolute bottom-[14px] right-[8px]"></div>
      </div>
      <div className="w-full mt-[10px] flex flex-wrap justify-center items-center">
        <div className="w-full flex justify-start items-center">
          <div className={styles.nftName}>{nftName}</div>
        </div>
        <div className="w-full flex justify-between items-center">
          <div className="flex justify-start items-center">
            <div className={styles.artistName}>
              {artistName} / {getShortAddress(mintAddress)}
            </div>
          </div>
        </div>
        <div className="w-full mt-[6px] flex justify-between items-end">
          <div className="flex flex-wrap gap-[2px]">
            {category.map((item, index) => (
              <SmallCategoryChip data={item} key={index} />
            ))}
          </div>
          <div className="items-center">
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
            <div className={styles.priceName}>Floor Price</div>
          </div>
        </div>
      </div>
      {mouseOver && (
        <div className={styles.bgModal}>
          <GradientButton
            label="Update"
            onClick={() => onClick()}
            height="48px"
            fontSize="18px"
            paddingLeft="37px"
            paddingRight="37px"
            backgroundColor01="#63D6CD"
            backgroundColor02="#326B67"
            gradientDirection="bottom"
          />
        </div>
      )}
    </div>
  )
}

export default UpdateCollectionCard
