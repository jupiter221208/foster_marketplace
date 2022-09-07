import React, { useState } from 'react'

// next components
import Image from 'next/image'

// custom components
import GradientButton from 'components/Button/GradientButton'

// images and icons
import SolanaLogoIcon from 'assets/icons/solana-logo.svg'

// styles
import styles from './index.module.scss'

const UpdateNFTCard = props => {
  const { viewport, image, nftName, artistName, price, showCount = true, onClick } = props

  const [mouseOver, setMouseOver] = useState(false)

  return (
    <div className={styles.container} onMouseOver={() => setMouseOver(true)} onMouseLeave={() => setMouseOver(false)}>
      <div className="w-full rounded-[10px] lg:rounded-[24px] overflow-hidden">
        <Image src={image} alt="" width={321} height={378} layout="responsive" objectFit="cover" />
      </div>
      <div className="w-full mt-[10px] flex flex-wrap justify-center items-center px-[9px]">
        <div className="w-full flex items-center">
          <div className={styles.nftName}>{nftName}</div>
        </div>
        <div className="w-full flex justify-between items-center">
          <div className={styles.artistName}>{artistName}</div>
          {showCount ? (
            <div className="flex justify-center items-center">
              <Image
                src={SolanaLogoIcon}
                alt=""
                width={viewport === 'xs' ? 15 : viewport === 'sm' || viewport === 'md' ? 18 : 23}
                height={viewport === 'xs' ? 15 : viewport === 'sm' || viewport === 'md' ? 18 : 23}
              />
              <div className={styles.price}>{price}</div>
            </div>
          ) : (
            <></>
          )}
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

export default UpdateNFTCard
