import React, { useEffect, useState } from 'react'
// next components
import Image from 'next/image'

// custom functions
import { useViewport } from 'utils'

// images and icons
import SolanaLogoIcon from 'assets/icons/solana-logo-dark.svg?component'
import SolanaLogoMobileIcon from 'assets/icons/solana-logo-dark-tiny.svg?component'
import DefaultNftBG from 'assets/images/default-nft-bg.png'
import PlayVideoIcon from 'assets/icons/play-video.svg'
import PauseVideoIcon from 'assets/icons/pause-video.svg'

// styles
import styles from './index.module.scss'

import Link from 'next/link'
import { getShortName } from 'utils/strings'
import ImageWithFoster from 'components/ImageWithFoster'

type ListedNftCardExploreTypes = {
  nftName: string
  artistName: string
  token_id: string
  image: string
  coverImage?: string
  assetType: string
  price: number
  onClick: () => void
}

const ListedNftCardExplore = (props: ListedNftCardExploreTypes) => {
  const { nftName, artistName, token_id, image, coverImage = null, assetType, onClick, price } = props
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
                  <a>
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
                  <a>
                    <ImageWithFoster
                      src={coverImage}
                      width={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 200 : 400}
                      onClick={onClick}
                      className="w-full h-full object-cover"
                    />
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
                <a>
                  <ImageWithFoster
                    src={coverImage}
                    width={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 200 : 400}
                    onClick={onClick}
                    className={styles.imageNft}
                  />
                </a>
              </Link>
            ) : image !== null && image !== '' ? (
              <Link href={`${window.origin}/nft/${token_id}`} passHref>
                <a>
                  <ImageWithFoster src={image} onClick={onClick} className={styles.imageNft} />
                </a>
              </Link>
            ) : (
              <Link href={`${window.origin}/nft/${token_id}`} passHref>
                <a className="w-full h-full">
                  <Image
                    src={DefaultNftBG}
                    width={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 200 : 400}
                    className={styles.imageNft}
                    onClick={() => onClick()}
                  />
                </a>
              </Link>
            )}
          </div>
          <div className={styles.nftData}>
            <div>
              <div className={styles.nftName}>{getShortName(nftName, 20)}</div>
              <div className={styles.artistName}>{artistName}</div>
            </div>
            <div>&nbsp;</div>
          </div>
        </div>

        <div className={styles.imageInfo}>
          <div className="w-full">
            <div className="flex items-center justify-between">
              <div className={styles.label}>Fixed Price</div>
            </div>
            <div className="w-full flex justify-between items-center mt-[5px]">
              <div className="flex justify-center items-center mt-[2px]">
                {viewport === 'sm' || viewport === 'xs' || viewport === 'md' ? (
                  <SolanaLogoMobileIcon />
                ) : (
                  <SolanaLogoIcon />
                )}
                <div className={styles.price}>{price}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ListedNftCardExplore
