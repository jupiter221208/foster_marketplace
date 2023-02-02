import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'

// next components
import Image from 'next/image'

// custom functions
import { useViewport } from 'utils'
import { calculateTimeLeft, formattedAmount } from 'utils/helpers'

// images and icons
import SolanaLogoIcon from 'assets/icons/solana-logo.svg'
import AvatarImage from 'assets/images/dashboard-avatar.png'
import DefaultNftBG from 'assets/images/default-nft-bg.svg'
import PlayVideoIcon from 'assets/icons/play-video.svg'
import PauseVideoIcon from 'assets/icons/pause-video.svg'

// styles
import styles from './index.module.scss'

const LiveAuctionCard = props => {
  const { data, onClick } = props
  const router = useRouter()
  const viewport = useViewport()
  const dispatch = useDispatch()
  const [timeLeft, setTimeLeft] = useState(null)
  const [play, setPlay] = useState(false)
  const [auctionStarted, setAuctionStarted] = useState(true)

  useEffect(() => {
    if (
      data.start_time !== null &&
      data.start_time !== undefined &&
      data.end_time !== undefined &&
      data.end_time !== null
    ) {
      setTimeLeft(calculateTimeLeft(getStartTime(data) * 1000))

      const timer = setInterval(() => {
        setTimeLeft(calculateTimeLeft(getStartTime(data) * 1000))
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [data.start_time, data.end_time])

  const getStartTime = data => {
    let difference = Number(data.start_time) * 1000 - +new Date()
    if (difference >= 0) {
      setAuctionStarted(false)
      return Number(data.start_time)
    } else {
      setAuctionStarted(true)
      return Number(data.end_time)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.imageArea}>
        <div className={styles.imageContent}>
          {data.asset_type === 'video' ? (
            viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? (
              <div className="w-full relative flex justify-center items-center rounded-[10px] lg:rounded-[24px] overflow-hidden">
                {play ? (
                  <div
                    className="w-full h-full absolute"
                    dangerouslySetInnerHTML={{
                      __html: `<video autoplay loop muted webkit-playsinline playsinline class="w-full h-full object-cover rounded-[10px] lg:rounded-[24px] overflow-hidden">
                <source src=${data.asset_url} type="video/mp4" /></video>`,
                    }}
                    onClick={() => onClick()}
                  />
                ) : data.cover_image_url != null && data.cover_image_url !== '' ? (
                  <img
                    src={data.cover_image_url}
                    alt=""
                    className="w-full h-full rounded-[10px] lg:rounded-[24px] object-cover"
                    onClick={() => onClick()}
                  />
                ) : (
                  <Image src={DefaultNftBG} alt="" className="w-full h-full object-cover" onClick={() => onClick()} />
                )}
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
                <source src=${data.asset_url} type="video/mp4" /></video>`,
                }}
                onClick={() => onClick()}
              />
            )
          ) : data.asset_type === 'audio' ? (
            <img
              src={data.cover_image_url}
              alt=""
              className="w-full h-full rounded-[10px] lg:rounded-[24px] object-cover"
              onClick={() => onClick()}
            />
          ) : (
            <img
              src={data.asset_url}
              alt=""
              className="w-full h-full rounded-[10px] lg:rounded-[24px] object-cover"
              onClick={() => onClick()}
            />
          )}
        </div>
      </div>
      <div
        className={styles.avatar}
        onClick={() => {
          router.push(`/artist-profile?id=${data.artist_id}`)
          dispatch({ type: 'set', isLoading: true })
        }}
      >
        {data.artist_profile_picture === null || data.artist_profile_picture.length === 0 ? (
          <Image
            width={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 32 : 36}
            height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 32 : 36}
            src={AvatarImage}
            alt=""
            className="rounded-full"
          />
        ) : (
          <img
            width={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 32 : 36}
            height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 32 : 36}
            src={data.artist_profile_picture}
            alt=""
            className="rounded-full"
          />
        )}
      </div>
      <div className={styles.bidContainer}>
        <div className={styles.bidBgView} />
        <div className={styles.bidGradientBgView} />
        <div className={styles.bidContentView}>
          <div>
            <div className={styles.bidName}>
              {data.current_bid !== null ? 'CURRENT BID' : auctionStarted ? 'STARTING BID' : 'RESERVE PRICE'}
            </div>
            <div className={styles.bidCountContainer}>
              <Image
                src={SolanaLogoIcon}
                alt=""
                width={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 15 : viewport === 'xl' ? 18 : 23}
                height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 15 : viewport === 'xl' ? 18 : 23}
              />
              <div className={styles.bidCount}>
                {data.current_bid !== null ? formattedAmount(data.current_bid) : formattedAmount(data.reserve_price)}
              </div>
            </div>
          </div>

          <div>
            <div className={styles.bidTime}>{auctionStarted ? 'TIME REMAINING' : 'AUCTION STARTS IN'}</div>
            <div className="flex justify-center">
              <div>
                <div className={styles.endTime}>
                  {timeLeft && timeLeft['days']}
                  <div className={styles.bidDesc}>D</div>
                </div>
              </div>
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
