import React, { useState, useEffect } from 'react'

// next components
import Image from 'next/image'
import Link from 'next/link'

// custom functions
import { useViewport } from 'utils'
import { calculateAuctionTimeLeft, formattedAmount, getTimeDifference } from 'utils/helpers'

// images and icons
import SolanaLogoMobileIcon from 'assets/icons/solana-logo-14x12.svg?component'
import DefaultAvatar from 'assets/images/dashboard-avatar.png'
import PlayVideoIcon from 'assets/icons/play-video.svg'
import PauseVideoIcon from 'assets/icons/pause-video.svg'

// styles
import styles from './index.module.scss'
import ImageWithFoster from 'components/ImageWithFoster'
import { getDisplayUserName } from 'utils/strings'

const LiveAuctionCard = props => {
  const { data, onClick, setCardExpired } = props
  const viewport = useViewport()
  const [timeLeft, setTimeLeft] = useState(null)
  const [play, setPlay] = useState(false)
  const [auctionStarted, setAuctionStarted] = useState(true)
  const [hover, setHover] = useState(false)
  useEffect(() => {
    if (
      data.asset_type.includes('video') &&
      (viewport === 'xs' || viewport === 'sm' || viewport === 'md') &&
      data.cover_image_url == null
    ) {
      let hidden_video: HTMLVideoElement = document.getElementById('hidden_video') as HTMLVideoElement
      hidden_video.currentTime = 3
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const isExpired = () => {
    if (
      timeLeft &&
      timeLeft['days'] === '00' &&
      timeLeft['hours'] === '00' &&
      timeLeft['minutes'] === '00' &&
      timeLeft['seconds'] === '00'
    )
      return true
    return false
  }
  return (
    <div className={styles.layout} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <div className={styles.container}>
        <div className={styles.profileContainer}>
          <div className="max-w-[70%]">
            <Link href={`/nft/${data.token_id}`} passHref>
              <a>
                <div className={styles.nftName}>{data?.nft_name}</div>
              </a>
            </Link>
            <Link href={`/${data.artist_username}`} passHref>
              <a>
                <div className={styles.artistName}>{getDisplayUserName(data?.artist_username)}</div>
              </a>
            </Link>
          </div>
          <Link href={`/${data.artist_username}`} passHref>
            <a>
              {data?.artist_profile_picture === undefined ||
              data?.artist_profile_picture === null ||
              data?.artist_profile_picture === '' ? (
                <Image src={DefaultAvatar} width={44} height={44} className="w-[44px] h-[44px] rounded-full" alt="" />
              ) : (
                <img
                  src={data?.artist_profile_picture}
                  onClick={() => {}}
                  width={44}
                  height={44}
                  className="w-[44px] rounded-full"
                />
              )}
            </a>
          </Link>
        </div>
        <div className={styles.imageArea}>
          <div className={styles.imageContent}>
            {data.asset_type.includes('video') ? (
              viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? (
                <div className="w-full relative flex justify-center items-center overflow-hidden">
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
                          width={500}
                          onClick={onClick}
                          className="max-w-full max-h-full object-cover"
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
                    width={500}
                    className="max-w-full max-h-full object-cover"
                    onClick={() => onClick()}
                  />
                </a>
              </Link>
            ) : data.cover_image_url ? (
              <Link href={`${window.origin}/nft/${data.token_id}`} passHref>
                <a className="w-full h-full">
                  <ImageWithFoster
                    src={data.cover_image_url}
                    width={500}
                    onClick={onClick}
                    className="max-w-full max-h-full object-cover"
                  />
                </a>
              </Link>
            ) : (
              <Link href={`${window.origin}/nft/${data.token_id}`} passHref>
                <a className="w-full h-full">
                  <ImageWithFoster
                    src={data.asset_url}
                    width={500}
                    onClick={onClick}
                    className="max-w-full max-h-full object-cover"
                  />
                </a>
              </Link>
            )}
          </div>
        </div>

        <div className={`${styles.bidContainer} ${hover ? styles.bottomHover : ''}`}>
          <div className={styles.bidContentView}>
            {isExpired() ? (
              <div className="w-full flex justify-between">
                <div className={styles.bidName}>{'Status'}</div>
              </div>
            ) : (
              <div className="w-full flex justify-between">
                <div className={styles.bidName}>{data.current_bid !== null ? 'Current Bid' : 'Reserve Price'}</div>
                <div className={styles.bidTime}>{auctionStarted ? 'Time Remaining' : 'Auction Starts In'}</div>
              </div>
            )}
            <div>
              {isExpired() ? (
                <div className={styles.bidCountContainer}>
                  <div className={styles.bidCount}>{'Auction Ended'}</div>
                </div>
              ) : (
                <div className={styles.bidCountContainer}>
                  <div className={`h-full mt-[3px] mr-[5px] ${styles.sol_icon_color}`}>
                    <SolanaLogoMobileIcon alt="" />
                  </div>
                  <div className={styles.bidCount}>
                    {data.current_bid !== null && data.current_bid > 0
                      ? formattedAmount(data.current_bid)
                      : data.reserve_price !== null
                      ? formattedAmount(data.reserve_price)
                      : ''}
                  </div>
                </div>
              )}
            </div>

            {isExpired() ? (
              <></>
            ) : (
              <div>
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
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LiveAuctionCard
