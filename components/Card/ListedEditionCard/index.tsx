import React, { useEffect, useState } from 'react'

// next components
// import Image from 'next/image'

// custom components
import GradientButton from 'components/Button/GradientButton'

// custom functions
import { useViewport } from 'utils'

// images and icons
import SolanaLogoIcon from 'assets/icons/solana-logo-dark.svg?component'
import SolanaLogoMobileIcon from 'assets/icons/solana-logo-dark-mobile.svg?component'

// styles
import styles from './index.module.scss'
import { getPriceValue, getDisplayUserName } from 'utils/strings'
import Link from 'next/link'
import ImageWithFoster from 'components/ImageWithFoster'

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
                    __html: `<video autoplay loop muted webkit-playsinline playsinline class="w-full h-full object-cover rounded-[10px] lg:rounded-[24px] overflow-hidden">
              <source src=${assetUrl} type="video/mp4" /></video>`,
                  }}
                />
              ) : (
                <div className="w-full h-full">
                  <ImageWithFoster
                    src={coverUrl}
                    width={360}
                    className="w-full h-full rounded-[10px] lg:rounded-[24px] object-cover"
                  />
                </div>
              )}
            </div>
          </a>
        </Link>
      </div>
      <div className="w-full mt-[10px] flex flex-wrap justify-center items-center">
        <div className="w-full flex items-center">
          <div className={styles.nftName}>{name}</div>
        </div>
        <div className="w-full flex justify-between items-center">
          <div className={styles.artistName}>{getDisplayUserName(creatorAddress)}</div>
          <div className="flex items-center mt-2 gap-[6px]">
            <SolanaLogoIcon alt="" />
            <div className={styles.nftName}>{getPriceValue(price)}</div>
          </div>
        </div>
        <div className="mt-[7px] w-full">
          <GradientButton
            label={'Cancel Listing'}
            onClick={() => {}}
            height="48px"
            fontSize="16px"
            fullWidth
            borderRadius="10px"
            borderWidth="1px"
          />
        </div>
      </div>
    </div>
  ) : (
    <div className={styles.container}>
      <div className={styles.imageArea}>
        <div className={styles.imageContent} onClick={() => onClick(`/nft/${address}`)}>
          <ImageWithFoster width={200} src={coverUrl} className="w-full h-full rounded-[10px] object-cover" />
        </div>
      </div>
      <div className="w-full mt-[10px] flex flex-wrap justify-center items-center">
        <div className="w-full flex items-center">
          <div className={styles.nftName}>{name}</div>
        </div>
        <div className="w-full flex justify-between items-center">
          <div className={styles.artistName}>{getDisplayUserName(creatorAddress)}</div>
          <div className="flex items-center gap-[6px]">
            <SolanaLogoMobileIcon alt="" />
            <div className={styles.price}>{getPriceValue(price)}</div>
          </div>
        </div>

        <div className="w-full flex justify-between items-center mt-2">
          <GradientButton
            label={'Cancel Listing'}
            onClick={() => {}}
            height="35px"
            fontSize="14px"
            fullWidth
            borderRadius="6px"
            borderWidth="1px"
          />
        </div>
      </div>
    </div>
  )
}

export default ListedEditionCard
