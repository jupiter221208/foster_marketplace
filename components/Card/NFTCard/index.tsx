import React, { useState } from 'react'

// next components
import Image from 'next/image'

// custom functions
import { useViewport } from 'utils'

// images and icons
import SolanaLogoIcon from 'assets/icons/solana-logo.svg'
import DefaultNftBG from 'assets/images/default-nft-bg.svg'
import PlayVideoIcon from 'assets/icons/play-video.svg'
import PauseVideoIcon from 'assets/icons/pause-video.svg'

// styles
import styles from './index.module.scss'

const DashboardNFTCard = props => {
  const { image, nftName, artistName, assetType, price, onClick } = props
  const viewport = useViewport()
  const [play, setPlay] = useState(false)

  return (
    <div className={styles.container}>
      <div className={styles.imageArea}>
        <div className={styles.imageContent}>
          {assetType === 'video' ? (
            viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? (
              <div className="w-full relative flex justify-center items-center">
                <div
                  className="w-full absolute"
                  dangerouslySetInnerHTML={{
                    __html: `<video ${
                      play ? 'autoplay' : ''
                    } loop muted webkit-playsinline playsinline class="w-full h-full object-cover rounded-[10px] lg:rounded-[24px] overflow-hidden">
                    <source src=${image} type="video/mp4" /></video>`,
                  }}
                  onClick={() => onClick()}
                />
                <div className={styles.playButton}>
                  <div className={`${play ? 'w-[18px]' : 'w-[22px]'} h-[18px] flex justify-end`}>
                    <Image
                      src={play ? PauseVideoIcon : PlayVideoIcon}
                      width={18}
                      height={18}
                      alt=""
                      onClick={() => setPlay(!play)}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div
                dangerouslySetInnerHTML={{
                  __html: `<video autoplay loop muted webkit-playsinline playsinline class="w-full h-full object-cover rounded-[10px] lg:rounded-[24px] overflow-hidden">
                  <source src=${image} type="video/mp4" /></video>`,
                }}
                onClick={() => onClick()}
              />
            )
          ) : (
            <img
              src={image !== '' ? image : DefaultNftBG}
              alt=""
              className="w-full h-full rounded-[10px] lg:rounded-[24px] object-cover"
              onClick={() => onClick()}
            />
          )}
        </div>
      </div>
      <div className="w-full mt-[10px] flex flex-wrap justify-center items-center px-[9px]">
        <div className="w-full flex items-center">
          <div className={styles.nftName}>{nftName}</div>
        </div>
        <div className="w-full flex justify-between items-center mt-[2px]">
          <div className={styles.artistName}>{artistName !== undefined && artistName}</div>
          {price && (
            <div className="flex justify-center items-center">
              <Image
                src={SolanaLogoIcon}
                alt=""
                width={viewport === 'xs' ? 15 : viewport === 'sm' || viewport === 'md' ? 18 : 23}
                height={viewport === 'xs' ? 15 : viewport === 'sm' || viewport === 'md' ? 18 : 23}
              />
              <div className={styles.price}>{price}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DashboardNFTCard
