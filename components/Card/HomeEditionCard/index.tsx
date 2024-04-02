import React, { useState, useEffect } from 'react'

// next components
import Image from 'next/image'
import Link from 'next/link'

// custom functions
import { useViewport } from 'utils'

// images and icons
import SolanaLogoMobileIcon from 'assets/icons/solana-logo-dark-mobile.svg?component'
import DefaultAvatar from 'assets/images/dashboard-avatar.png'
import PlayVideoIcon from 'assets/icons/play-video.svg'
import PauseVideoIcon from 'assets/icons/pause-video.svg'

// styles
import styles from './index.module.scss'
import ImageWithFoster from 'components/ImageWithFoster'
import { getDisplayUserName, getPriceValue } from 'utils/strings'

const HomeEditionCard = props => {
  const { data, type = 'limit', onClick } = props
  const viewport = useViewport()
  const [play, setPlay] = useState(false)

  useEffect(() => {
    if (
      data.assetType.includes('video') &&
      (viewport === 'xs' || viewport === 'sm' || viewport === 'md') &&
      data.coverImageUrl == null
    ) {
      let hidden_video: HTMLVideoElement = document.getElementById('hidden_video') as HTMLVideoElement
      hidden_video.currentTime = 3
    }
  }, [data])

  return (
    <div className={styles.container}>
      <div className={styles.profileContainer}>
        <div>
          <Link href={`/nft/${data.tokenId}`} passHref>
            <a>
              <div className={styles.nftName}>{data?.nftName}</div>
            </a>
          </Link>
          <Link href={`/${data.artistUsername}`} passHref>
            <a>
              <div className={styles.artistName}>{getDisplayUserName(data?.artistUsername)}</div>
            </a>
          </Link>
        </div>
        <Link href={`/${data.artistUsername}`} passHref>
          <a>
            {data?.artistProfilePicture === undefined ||
            data?.artistProfilePicture === null ||
            data?.artistProfilePicture === '' ? (
              <img src={DefaultAvatar.src} className="w-[45px] sm:w-[56px] h-[45px] sm:h-[56px] rounded-full" />
            ) : (
              <img
                src={data?.artistProfilePicture}
                onClick={() => {}}
                className="w-[45px] sm:w-[56px] h-[45px] sm:h-[56px] rounded-full"
              />
            )}
          </a>
        </Link>
      </div>
      <div className={styles.imageArea}>
        <div className={styles.imageContent}>
          {data.assetType.includes('video') ? (
            viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? (
              <div className="w-full relative flex justify-center items-center overflow-hidden">
                <Link href={`${window.origin}/nft/${data.tokenId}`} passHref>
                  <a className="w-full h-full">
                    {play ? (
                      <div
                        className="w-full h-full absolute"
                        dangerouslySetInnerHTML={{
                          __html: `<video autoplay loop muted webkit-playsinline playsinline class="w-full h-full object-cover overflow-hidden">
              <source src=${data.assetUrl} type="video/mp4" /></video>`,
                        }}
                        onClick={() => onClick()}
                      />
                    ) : data.coverImageUrl != null && data.coverImageUrl !== '' ? (
                      <ImageWithFoster
                        src={data.coverImageUrl}
                        width={500}
                        onClick={onClick}
                        className="max-w-full max-h-full object-cover"
                      />
                    ) : (
                      <div
                        className="w-full h-full absolute"
                        dangerouslySetInnerHTML={{
                          __html: `<video id="hidden_video" muted webkit-playsinline playsinline class="w-full h-full object-contain overflow-hidden">
              <source src=${data.assetUrl} type="video/mp4" /></video>`,
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
              <Link href={`${window.origin}/nft/${data.tokenId}`} passHref>
                <a className="w-full h-full">
                  <div
                    className="w-full h-full"
                    dangerouslySetInnerHTML={{
                      __html: `<video autoplay loop muted webkit-playsinline playsinline class="w-full h-full object-cover overflow-hidden">
                <source src=${data.assetUrl} type="video/mp4" /></video>`,
                    }}
                    onClick={() => onClick()}
                  />
                </a>
              </Link>
            )
          ) : data.assetType.includes('audio') ? (
            <Link href={`${window.origin}/nft/${data.tokenId}`} passHref>
              <a className="w-full h-full">
                <ImageWithFoster
                  src={data.coverImageUrl}
                  width={500}
                  className="max-w-full max-h-full object-cover"
                  onClick={() => onClick()}
                />
              </a>
            </Link>
          ) : data.coverImageUrl ? (
            <Link href={`${window.origin}/nft/${data.tokenId}`} passHref>
              <a className="w-full h-full">
                <ImageWithFoster
                  src={data.coverImageUrl}
                  width={500}
                  onClick={onClick}
                  className="max-w-full max-h-full object-cover"
                />
              </a>
            </Link>
          ) : (
            <Link href={`${window.origin}/nft/${data.tokenId}`} passHref>
              <a className="w-full h-full">
                <ImageWithFoster
                  src={data.assetUrl}
                  width={500}
                  onClick={onClick}
                  className="max-w-full max-h-full object-cover"
                />
              </a>
            </Link>
          )}
        </div>
      </div>

      <div className={styles.bidContainer}>
        <div className={styles.bidContentView}>
          <div className="w-full flex justify-between">
            <div className={styles.bidName}>Price</div>
            <div className={styles.bidTime}>Limited Edition</div>
          </div>
          <div>
            <div className={styles.bidCountContainer}>
              <div className="h-full mt-[2px]">
                <SolanaLogoMobileIcon alt="" />
              </div>
              <div className={styles.bidCount}>{getPriceValue(Number(data.price))}</div>
            </div>
          </div>

          <div>
            <div className={styles.bidCountContainer}>
              {type === 'limit' ? (
                <div className={styles.bidCount}>{data.currentSupply + '/' + data.maxSupply + ' left'}</div>
              ) : (
                <div className={styles.bidCount}>{data.currentSupply + ' sold'}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomeEditionCard
