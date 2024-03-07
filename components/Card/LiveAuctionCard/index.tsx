import React, { useState, useEffect } from 'react'

// next components
import Image from 'next/image'
import Link from 'next/link'

// custom functions
import { useViewport } from 'utils'
import { formattedAmount, getTimeDifference } from 'utils/helpers'

// images and icons
import SolanaLogoIcon from 'assets/icons/solana-logo-dark.svg?component'
import SolanaLogoMobileIcon from 'assets/icons/solana-logo-dark-small.svg?component'

import PlayVideoIcon from 'assets/icons/play-video.svg'
import PauseVideoIcon from 'assets/icons/pause-video.svg'

// styles
import styles from './index.module.scss'
import ImageWithFoster from 'components/ImageWithFoster'

const LiveAuctionCard = props => {
  const { data, onClick, setCardExpired } = props
  const viewport = useViewport()
  const [timeLeft, setTimeLeft] = useState(null)
  const [play, setPlay] = useState(false)
  const [auctionStarted, setAuctionStarted] = useState(true)

  useEffect(() => {
    if (
      data.asset_type.includes('video') &&
      (viewport === 'xs' || viewport === 'sm' || viewport === 'md') &&
      data.cover_image_url == null
    ) {
      let hidden_video: HTMLVideoElement = document.getElementById('hidden_video') as HTMLVideoElement
      hidden_video.currentTime = 3
    }
  }, [data])

  const calculateAuctionTimeLeft = endDate => {
    let difference = getTimeDifference(endDate)
    let timeLeft = {}

    if (difference > 0) {
      const seconds = Math.floor((difference / 1000) % 60)
      const minutes = Math.floor((difference / 1000 / 60) % 60)
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24)
      const days = Math.floor(difference / (1000 * 60 * 60 * 24))
      timeLeft['seconds'] = (seconds < 10 && '0') + seconds + ''
      timeLeft['minutes'] = (minutes < 10 && '0') + minutes + ''
      timeLeft['hours'] = (hours < 10 && '0') + hours + ''
      timeLeft['days'] = (days < 10 && '0') + days + ''
    } else {
      timeLeft = {
        days: '00',
        hours: '00',
        minutes: '00',
        seconds: '00',
      }
    }

    return timeLeft
  }

  useEffect(() => {
    if (
      data.start_time !== null &&
      data.start_time !== undefined &&
      data.end_time !== undefined &&
      data.end_time !== null
    ) {
      setTimeLeft(calculateAuctionTimeLeft(getStartTime(data)))

      const timer = setInterval(() => {
        let timeLeft = calculateAuctionTimeLeft(getStartTime(data))
        if (
          timeLeft['days'] === '00' &&
          timeLeft['hours'] === '00' &&
          timeLeft['minutes'] === '00' &&
          timeLeft['seconds'] === '00'
        )
          setCardExpired(data)
        setTimeLeft(timeLeft)
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [data.start_time, data.end_time])

  const getStartTime = data => {
    let difference = getTimeDifference(data.start_time)

    if (difference >= 0) {
      setAuctionStarted(false)
      return data.start_time
    } else {
      setAuctionStarted(true)
      return data.end_time
    }
  }
  return (
    <div className={styles.container}>
      <div className={styles.imageArea}>
        <div className={styles.imageContent}>
          {data.asset_type.includes('video') ? (
            viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? (
              <div className="w-full relative flex justify-center items-center rounded-t-[24px] overflow-hidden">
                <Link href={`${window.origin}/nft/${data.token_id}`} passHref>
                  <a className="w-full h-full">
                    {play ? (
                      <div
                        className="w-full h-full absolute"
                        dangerouslySetInnerHTML={{
                          __html: `<video autoplay loop muted webkit-playsinline playsinline class="w-full h-full object-cover overflow-hidden">
              <source src=${data.asset_url} type="video/mp4" /></video>`,
                        }}
                        onClick={() => onClick()}
                      />
                    ) : data.cover_image_url != null && data.cover_image_url !== '' ? (
                      <ImageWithFoster
                        src={data.cover_image_url}
                        onClick={onClick}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div
                        className="w-full h-full absolute"
                        dangerouslySetInnerHTML={{
                          __html: `<video id="hidden_video" muted webkit-playsinline playsinline class="w-full h-full object-contain overflow-hidden">
              <source src=${data.asset_url} type="video/mp4" /></video>`,
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
              <Link href={`${window.origin}/nft/${data.token_id}`} passHref>
                <a className="w-full h-full">
                  <div
                    className="w-full h-full"
                    dangerouslySetInnerHTML={{
                      __html: `<video autoplay loop muted webkit-playsinline playsinline class="w-full h-full object-cover overflow-hidden">
                <source src=${data.asset_url} type="video/mp4" /></video>`,
                    }}
                    onClick={() => onClick()}
                  />
                </a>
              </Link>
            )
          ) : data.asset_type.includes('audio') ? (
            <Link href={`${window.origin}/nft/${data.token_id}`} passHref>
              <a className="w-full h-full">
                <ImageWithFoster
                  src={data.cover_image_url}
                  width={504}
                  className="w-full h-full object-cover"
                  onClick={() => onClick()}
                />
              </a>
            </Link>
          ) : data.cover_image_url ? (
            <Link href={`${window.origin}/nft/${data.token_id}`} passHref>
              <a className="w-full h-full">
                <ImageWithFoster
                  src={data.cover_image_url}
                  width={504}
                  onClick={onClick}
                  className="w-full h-full object-cover"
                />
              </a>
            </Link>
          ) : (
            <Link href={`${window.origin}/nft/${data.token_id}`} passHref>
              <a className="w-full h-full">
                <ImageWithFoster
                  src={data.asset_url}
                  width={504}
                  onClick={onClick}
                  className="w-full h-full object-cover"
                />
              </a>
            </Link>
          )}
        </div>
      </div>
      <div className={styles.profileContainer}>
        <div>
          <Link href={`/nft/${data.token_id}`} passHref>
            <a>
              <div className={styles.nftName}>{data?.nft_name}</div>
            </a>
          </Link>
          <Link href={`/${data.artist_username}`} passHref>
            <a>
              <div className={styles.artistName}>{data?.artist_username}</div>
            </a>
          </Link>
        </div>
        <Link href={`/${data.artist_username}`} passHref>
          <a>
            <ImageWithFoster
              src={data?.artist_profile_picture}
              onClick={() => {}}
              width={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 44 : 56}
              height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 44 : 56}
              className="lg:w-[56px] w-[44px] rounded-full"
            />
          </a>
        </Link>
      </div>
      <div className={styles.bidContainer}>
        <div className={styles.bidContentView}>
          <div>
            <div className={styles.bidName}>{data.current_bid !== null ? 'Current Bid' : 'Reserve Price'}</div>
            <div className={styles.bidCountContainer}>
              <div className="h-full">
                {viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? (
                  <SolanaLogoMobileIcon alt="" />
                ) : (
                  <SolanaLogoIcon alt="" />
                )}
              </div>
              <div className={styles.bidCount}>
                {data.current_bid !== null && data.current_bid > 0
                  ? formattedAmount(data.current_bid)
                  : formattedAmount(data.reserve_price)}
              </div>
            </div>
          </div>

          <div>
            <div className={styles.bidTime}>{auctionStarted ? 'Time Remaining' : 'Auction Starts In'}</div>
            <div className={styles.bidCountContainer}>
              {timeLeft && timeLeft['days'] !== '00' && (
                <div>
                  <div className={styles.endTime}>
                    {timeLeft && timeLeft['days']}
                    <div className={styles.bidDesc}>D</div>
                  </div>
                </div>
              )}
              <div className={styles.endTimeContainer}>
                <div className={styles.endTime}>
                  {timeLeft && timeLeft['hours']}
                  <div className={styles.bidDesc}>H</div>
                </div>
              </div>
              <div className={styles.endTimeContainer}>
                <div className={styles.endTime}>
                  {timeLeft && timeLeft['minutes']}
                  <div className={styles.bidDesc}>M</div>
                </div>
              </div>
              <div className={styles.endTimeContainer}>
                <div className={styles.endTime}>
                  {timeLeft && timeLeft['seconds']}
                  <div className={styles.bidDesc}>S</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LiveAuctionCard
