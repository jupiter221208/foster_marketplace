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
import ClockSandIcon from 'assets/icons/clock-sand-icon.svg?component'
import ClockSandMobileIcon from 'assets/icons/clock-sand-icon-mobile.svg?component'

// styles
import styles from './index.module.scss'

import { useDispatch } from 'react-redux'
import { getTimeDifference } from 'utils/helpers'
import Link from 'next/link'
import ImageWithFoster from 'components/ImageWithFoster'
import { getDisplayUserName, getPriceValue } from 'utils/strings'

const NFTEditionsCard = props => {
  const {
    nftName,
    artistName,
    tokenId,
    image,
    currentSupply,
    maxSupply,
    price,
    statTime,
    endTime,
    coverImage = null,
    assetType,
    onClick,
    unSave = null,
  } = props
  const viewport = useViewport()
  const dispatch = useDispatch()
  const [play, setPlay] = useState(false)
  const [endDate, setEndDate] = useState({ day: 0, hour: 0, minute: 0, second: 0 })
  const [hideTimer, setHideTimer] = useState(false)
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

  useEffect(() => {
    getIntervalTime()

    const timer = setInterval(() => {
      getIntervalTime()
    }, 1000)

    return () => clearTimeout(timer)
  }, [endTime])

  const getIntervalTime = () => {
    if (endTime === undefined || endTime === null) {
      return
    }

    let difference = getTimeDifference(endTime)

    if (difference < 0) {
      setHideTimer(true)
      return
    }

    let seconds = difference / 1000

    let day = 0
    let hour = 0
    let minute = 0
    let endAuctionDate = { day: 0, hour: 0, minute: 0, second: 0 }

    let interval = seconds / 86400
    if (interval > 1) {
      day = Math.floor(interval)
      seconds = seconds % 86400
    }

    interval = seconds / 3600
    if (interval > 1) {
      hour = Math.floor(interval)
      seconds = seconds % 3600
    }

    interval = seconds / 60
    if (interval > 1) {
      minute = Math.floor(interval)
      seconds = Math.floor(seconds % 60)
    } else {
      seconds = Math.floor(seconds)
    }

    endAuctionDate = { day, hour, minute, second: seconds }

    setEndDate(endAuctionDate)
  }

  return (
    <div className="w-full h-full relative p-[2px] lg:p-[3px]">
      <div className={styles.container}>
        <div className={styles.imageArea}>
          <div className={styles.imageContent}>
            {assetType?.includes('video') ? (
              viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? (
                <div className="w-full relative flex justify-center items-center overflow-hidden">
                  <Link href={`${window.origin}/nft/${tokenId}`} passHref>
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
                <Link href={`${window.origin}/nft/${tokenId}`} passHref>
                  <a>
                    <div
                      className="w-full h-full"
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
                <Link href={`${window.origin}/nft/${tokenId}`} passHref>
                  <a className="w-full h-full flex items-center justify-center">
                    <div>
                      <ImageWithFoster
                        src={coverImage}
                        onClick={onClick}
                        width={800}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </a>
                </Link>
              ) : (
                <Link href={`${window.origin}/nft/${tokenId}`} passHref>
                  <a>
                    <Image src={DefaultNftBG} alt="" className="w-full h-full object-cover" onClick={() => onClick()} />
                  </a>
                </Link>
              )
            ) : coverImage != null && coverImage !== '' ? (
              <Link href={`${window.origin}/nft/${tokenId}`} passHref>
                <a className="w-full h-full  flex items-center justify-center">
                  <div>
                    <ImageWithFoster
                      src={coverImage}
                      width={800}
                      onClick={onClick}
                      alt=""
                      className={styles.imageNft}
                    />
                  </div>
                </a>
              </Link>
            ) : image !== null && image !== '' ? (
              <Link href={`${window.origin}/nft/${tokenId}`} passHref>
                <a className="w-full h-full  flex items-center justify-center">
                  <div>
                    <ImageWithFoster src={image} width={800} onClick={onClick} className={styles.imageNft} />
                  </div>
                </a>
              </Link>
            ) : (
              <Link href={`${window.origin}/nft/${tokenId}`} passHref>
                <a className="w-full h-full">
                  <Image src={DefaultNftBG} alt="" className={styles.imageNft} onClick={() => onClick()} />
                </a>
              </Link>
            )}
            {endTime && !hideTimer && (
              <div className={styles.timeContainer}>
                <div className="sm:block hidden">
                  <ClockSandIcon />
                </div>
                <div className="block sm:hidden">
                  <ClockSandMobileIcon />
                </div>
                <div className="flex gap-[4px] mt-[-1px]">
                  {endDate.day > 0 && (
                    <div className="flex gap-[2px]">
                      <div className={styles.timeValue}>{endDate.day}</div>
                      <div className={styles.day}>d</div>
                    </div>
                  )}
                  <div className="flex gap-[2px]">
                    <div className={styles.timeValue}>{endDate.hour}</div>
                    <div className={styles.day}>h</div>
                  </div>
                  <div className="flex gap-[2px]">
                    <div className={styles.timeValue}>{endDate.minute}</div>
                    <div className={styles.day}>m</div>
                  </div>
                  <div className="flex gap-[2px]">
                    <div className={styles.timeValue}>{endDate.second}</div>
                    <div className={styles.day}>s</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className={styles.nftData}>
          <div>
            <div className={styles.nftName}>{nftName}</div>
            <div className={styles.artistName}>{getDisplayUserName(artistName)}</div>
          </div>
          <div>&nbsp;</div>
        </div>
        <div className={styles.imageInfo}>
          <div className="w-full">
            <div className="flex items-center justify-between">
              <div className="w-full flex justify-between items-center">
                <div className={styles.currentBid}>Price</div>
                <div className={styles.currentBid}>{maxSupply === null ? 'Open Edition' : 'Limited Edition'}</div>
              </div>
            </div>
            <div className="w-full flex justify-between items-center mt-[6px]">
              <div className="flex justify-center items-center mt-[2px] gap-[6px]">
                <SolanaLogoIcon />
                <div className={styles.price}>{getPriceValue(Number(price))}</div>
              </div>
              <div className={styles.supply}>
                {maxSupply === null
                  ? currentSupply === undefined
                    ? '-'
                    : currentSupply + ' sold'
                  : (currentSupply === undefined || maxSupply === null
                      ? maxSupply
                      : parseInt(maxSupply) - parseInt(currentSupply)) +
                    '/' +
                    (maxSupply === undefined || maxSupply === null ? '0' : maxSupply) +
                    ' left'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NFTEditionsCard
