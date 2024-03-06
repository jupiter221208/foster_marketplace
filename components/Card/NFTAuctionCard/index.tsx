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
import GradientButton from 'components/Button/GradientButton'

import { useDispatch } from 'react-redux'
import { getTimeDifference } from 'utils/helpers'
import Link from 'next/link'
import ImageWithFoster from 'components/ImageWithFoster'

const NFTAuctionCard = props => {
  const {
    nftName,
    artistName,
    token_id,
    image,
    currentBid,
    reservePrice,
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
                <ImageWithFoster
                  link={`${window.origin}/nft/${token_id}`}
                  src={coverImage}
                  onClick={onClick}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Link href={`${window.origin}/nft/${token_id}`} passHref>
                  <a>
                    <Image src={DefaultNftBG} alt="" className="w-full h-full object-cover" onClick={() => onClick()} />
                  </a>
                </Link>
              )
            ) : coverImage != null && coverImage !== '' ? (
              <ImageWithFoster
                link={`${window.origin}/nft/${token_id}`}
                src={coverImage}
                onClick={onClick}
                alt=""
                className={styles.imageNft}
              />
            ) : image !== null && image !== '' ? (
              <ImageWithFoster
                link={`${window.origin}/nft/${token_id}`}
                src={image}
                onClick={onClick}
                className={styles.imageNft}
              />
            ) : (
              <Link href={`${window.origin}/nft/${token_id}`} passHref>
                <a className="w-full h-full">
                  <Image src={DefaultNftBG} alt="" className={styles.imageNft} onClick={() => onClick()} />
                </a>
              </Link>
            )}
          </div>
          <div className={styles.nftData}>
            <div>
              <div className={styles.nftName}>{nftName}</div>
              <div className={styles.artistName}>{artistName}</div>
            </div>
            <div>&nbsp;</div>
          </div>
        </div>

        <div className={styles.imageInfo}>
          <div className="w-full">
            <div className="flex items-center justify-between">
              <div className="w-full flex justify-between items-center mt-[-2px]">
                <div className={styles.currentBid}>{currentBid === null ? 'Reserve' : 'Current'}</div>
                <div className={styles.currentBid}>Ends In</div>
              </div>
            </div>
            <div className="w-full flex justify-between items-center mt-[5px]">
              <div className="flex justify-center items-center mt-[2px]">
                {viewport === 'sm' || viewport === 'xs' || viewport === 'md' ? (
                  <SolanaLogoMobileIcon />
                ) : (
                  <SolanaLogoIcon />
                )}
                <div className={styles.price}>{currentBid === null ? reservePrice : currentBid}</div>
              </div>
              <div className="flex gap-[4px] mt-[-1px]">
                {endDate.day > 0 && (
                  <div className="flex gap-[3px]">
                    <div className={styles.timeValue}>{endDate.day}</div>
                    <div className={styles.day}>d</div>
                  </div>
                )}
                <div className="flex gap-[3px]">
                  <div className={styles.timeValue}>{endDate.hour}</div>
                  <div className={styles.day}>h</div>
                </div>
                <div className="flex gap-[3px]">
                  <div className={styles.timeValue}>{endDate.minute}</div>
                  <div className={styles.day}>m</div>
                </div>
                <div className="flex gap-[2px]lg:flex">
                  <div className={styles.timeValue}>{endDate.second}</div>
                  <div className={styles.day}>s</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {unSave !== null && (
          <div className="mt-[10px]">
            <GradientButton
              fullWidth
              label="Unsave"
              onClick={() => {
                dispatch({ type: 'set', isLoading: true })
                unSave()
              }}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default NFTAuctionCard
