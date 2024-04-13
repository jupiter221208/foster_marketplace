import React, { useEffect, useState } from 'react'
// next components
import Image from 'next/image'

// custom functions
import { useViewport } from 'utils'

// images and icons
import SolanaLogoIcon from 'assets/icons/solana-logo-dark-mobile.svg?component'
import SolanaLogoMobileIcon from 'assets/icons/solana-logo-dark-tiny.svg?component'
import DefaultNftBG from 'assets/images/default-nft-bg.png'
import PlayVideoIcon from 'assets/icons/play-video.svg'
import PauseVideoIcon from 'assets/icons/pause-video.svg'

// styles
import styles from './index.module.scss'

import Link from 'next/link'
import { getDisplayUserName, getShortName } from 'utils/strings'
import ImageWithFoster from 'components/ImageWithFoster'

type ListedNftCardExploreTypes = {
  nftName: string
  artistName: string
  artistImage?: string
  token_id: string
  image: string
  coverImage?: string
  assetType: string
  price: number
  onClick: () => void
}

const ListedNftCardExplore = (props: ListedNftCardExploreTypes) => {
  const { nftName, artistName, artistImage, token_id, image, coverImage = null, assetType, onClick, price } = props
  const viewport = useViewport()
  const [play, setPlay] = useState(false)

  useEffect(() => {
    if (
      assetType.includes('video') &&
      (viewport === 'xs' || viewport === 'sm' || viewport === 'md') &&
      coverImage === null
    ) {
      let hidden_video: HTMLVideoElement = document.getElementById('hidden_video') as HTMLVideoElement
      hidden_video.currentTime = 3
    }
  }, [assetType])

  return (
    <div className="w-full h-full relative p-[2px] lg:p-[3px]">
      <div className={styles.container}>
        <div className={styles.imageArea}>
          <div className={styles.imageContent}>
            {assetType?.includes('video') ? (
              viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? (
                <div className="w-full relative flex justify-center items-center overflow-hidden">
                  <Link href={`${window.origin}/nft/${token_id}`} passHref>
                    <a className="w-full h-full relative">
                      {play ? (
                        <div
                          className="w-full h-full absolute"
                          dangerouslySetInnerHTML={{
                            __html: `<video autoplay loop muted webkit-playsinline playsinline class="w-full h-full object-cover overflow-hidden">
                    <source src=${image} type="video/mp4" /></video>`,
                          }}
                          onClick={() => onClick()}
                        />
                      ) : coverImage != null && coverImage !== '' ? (
                        <ImageWithFoster
                          src={coverImage}
                          width={200}
                          className="w-full h-full object-cover"
                          onClick={() => onClick()}
                        />
                      ) : (
                        <div
                          className="w-full h-full absolute"
                          dangerouslySetInnerHTML={{
                            __html: `<video id="hidden_video" loop muted webkit-playsinline playsinline class="w-full h-full object-cover overflow-hidden">
                    <source src=${image} type="video/mp4" /></video>`,
                          }}
                          onClick={() => onClick()}
                        />
                      )}
                    </a>
                  </Link>
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
                <Link href={`${window.origin}/nft/${token_id}`} passHref>
                  <a className="w-full h-full flex items-center">
                    <div
                      className="w-full"
                      dangerouslySetInnerHTML={{
                        __html: `<video autoplay loop muted webkit-playsinline playsinline class="w-full h-full object-cover overflow-hidden">
                  <source src=${image} type="video/mp4" /></video>`,
                      }}
                      onClick={() => onClick()}
                    />
                  </a>
                </Link>
              )
            ) : assetType?.includes('audio') ? (
              coverImage != null && coverImage !== '' ? (
                <Link href={`${window.origin}/nft/${token_id}`} passHref>
                  <a className="flex justify-center items-center">
                    <div className="w-full h-full">
                      <ImageWithFoster
                        src={coverImage}
                        width={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 200 : 360}
                        onClick={onClick}
                        className="max-w-full max-h-full object-cover"
                      />
                    </div>
                  </a>
                </Link>
              ) : (
                <Link href={`${window.origin}/nft/${token_id}`} passHref>
                  <a>
                    <Image src={DefaultNftBG} alt="" className="w-full h-full object-cover" onClick={() => onClick()} />
                  </a>
                </Link>
              )
            ) : coverImage != null && coverImage !== '' ? (
              <Link href={`${window.origin}/nft/${token_id}`} passHref>
                <a className="flex justify-center items-center">
                  <div className="w-full h-full">
                    <ImageWithFoster
                      src={coverImage}
                      width={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 200 : 360}
                      onClick={onClick}
                      className="max-w-full max-h-full object-cover"
                    />
                  </div>
                </a>
              </Link>
            ) : image !== null && image !== '' ? (
              <Link href={`${window.origin}/nft/${token_id}`} passHref>
                <a className="flex justify-center items-center">
                  <div className="w-full h-full">
                    <ImageWithFoster src={image} onClick={onClick} className="max-w-full max-h-full object-cover" />
                  </div>
                </a>
              </Link>
            ) : (
              <Link href={`${window.origin}/nft/${token_id}`} passHref>
                <a className="w-full h-full">
                  <Image
                    src={DefaultNftBG}
                    width={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 200 : 360}
                    className={styles.imageNft}
                    onClick={() => onClick()}
                  />
                </a>
              </Link>
            )}
          </div>
        </div>

        <div className={styles.imageInfo}>
          <div className={styles.nftData}>
            <div>
              <div className={styles.nftName}>{getShortName(nftName, price ? 15 : 24)}</div>
              <div className="w-full flex justify-between">
                <div className={styles.artistName}>{getDisplayUserName(artistName)}</div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.bottomInfo}>
          {price ? (
            <div className="">
              <div className={styles.priceLabel}>Price</div>
              <div className="w-full flex items-center mt-[6px]">
                {viewport === 'sm' || viewport === 'xs' || viewport === 'md' ? (
                  <SolanaLogoMobileIcon />
                ) : (
                  <SolanaLogoIcon />
                )}
                <div className={styles.price}>{price}</div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center">
              <div className={styles.unlisted}>Unlisted</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ListedNftCardExplore
