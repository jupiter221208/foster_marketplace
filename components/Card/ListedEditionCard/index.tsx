import React, { useEffect, useState } from 'react'

// next components
// import Image from 'next/image'

// custom components
import GradientButton from 'components/Button/GradientButton'

// custom functions
import { useViewport } from 'utils'

// images and icons
import SolanaLogoIcon from 'assets/icons/solana-logo-dark.svg?component'
import SolanaLogoMobileIcon from 'assets/icons/solana-logo-dark-tiny.svg?component'

// styles
import styles from './index.module.scss'
import { getPriceValue } from 'utils/strings'
import Link from 'next/link'
import ImageWithFoster from 'components/ImageWithFoster'
import OutlineButton from 'components/Button/OutlineButton'

export interface ListedEditionCardProps {
  data: any
  onClick: (uri: string) => any
  onCancelList: any
}

const ListedEditionCard = ({ data, onClick, onCancelList }: ListedEditionCardProps) => {
  const { address, name, type, assetUrl, coverUrl, creatorAddress, price } = data
  const viewport = useViewport()

  return viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? (
    <div className={styles.container}>
      <div className={styles.imageArea}>
        <Link href={`/nft/${address}`} passHref>
          <a>
            <div className={styles.imageContent}>
              {type === 'video' ? (
                <div
                  dangerouslySetInnerHTML={{
                    __html: `<video autoplay loop muted webkit-playsinline playsinline class="w-full h-full object-cover overflow-hidden">
              <source src=${assetUrl} type="video/mp4" /></video>`,
                  }}
                />
              ) : (
                <div className="w-full h-full">
                  <ImageWithFoster src={coverUrl} width={360} className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </a>
        </Link>
      </div>
      <div className={styles.bottomSection}>
        <div className="w-full flex justify-between items-center">
          <div className={styles.nftName}>{name}</div>
          <div className="flex items-center gap-[6px]">
            <div className="mt-[4px]">
              <SolanaLogoIcon alt="" />
            </div>
            <div className={styles.price}>{getPriceValue(price)}</div>
          </div>
        </div>
        <div className="w-full hidden lg:flex flex-wrap gap-[8px] mt-[15px]">
          <GradientButton label="Update/Relist" onClick={() => {}} fullWidth borderRadius={10} />

          <OutlineButton
            label={'Cancel Listing'}
            fullWidth
            backgroundColor="transparent"
            onClick={() => {}}
            fontFamily="Muli-SemiBold"
          />
        </div>
      </div>
    </div>
  ) : (
    <div className={styles.container}>
      <div className={styles.imageArea}>
        <div className={styles.imageContent} onClick={() => onClick(`/nft/${address}`)}>
          <ImageWithFoster width={200} src={coverUrl} className="w-full h-full object-cover" />
        </div>
      </div>
      <div className={styles.bottomSection}>
        <div className="w-full flex justify-between items-center">
          <div className={styles.nftName}>{name}</div>
          <div className="flex items-center gap-[2px]">
            <div className="mt-[2px]">
              <SolanaLogoMobileIcon alt="" />
            </div>
            <div className={styles.price}>{getPriceValue(price)}</div>
          </div>
        </div>

        <div className="w-full flex justify-between items-center mt-[6px]">
          <GradientButton
            label={'Cancel Listing'}
            onClick={() => {}}
            height="28px"
            fontSize="12px"
            fullWidth
            borderRadius="5px"
            borderWidth="1px"
          />
        </div>
      </div>
    </div>
  )
}

export default ListedEditionCard
