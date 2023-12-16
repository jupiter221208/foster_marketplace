import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'

// next components
import Image from 'next/image'
import Link from 'next/link'

// custom functions
import { useViewport } from 'utils'
import { calculateTimeLeft, formattedAmount, getTimeDifference } from 'utils/helpers'

// images and icons
import SolanaLogoIcon from 'assets/icons/solana-logo-dark.svg?component'
import SolanaLogoMobileIcon from 'assets/icons/solana-logo-dark-small.svg?component'

import DefaultNftBG from 'assets/images/default-nft-bg.png'
import PlayVideoIcon from 'assets/icons/play-video.svg'
import PauseVideoIcon from 'assets/icons/pause-video.svg'

// styles
import styles from './index.module.scss'
import ReactPlaceholder from 'react-placeholder/lib'
import 'react-placeholder/lib/reactPlaceholder.css'
import ImageWithFallback from 'components/ImageWithFallback'

const LiveAuctionCard = props => {
  const { data } = props
  const router = useRouter()
  const viewport = useViewport()
  const dispatch = useDispatch()
  const [timeLeft, setTimeLeft] = useState(null)
  const [play, setPlay] = useState(false)
  const [auctionStarted, setAuctionStarted] = useState(true)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (
      data.start_time !== null &&
      data.start_time !== undefined &&
      data.end_time !== undefined &&
      data.end_time !== null
    ) {
      setTimeLeft(calculateTimeLeft(getStartTime(data)))

      const timer = setInterval(() => {
        setTimeLeft(calculateTimeLeft(getStartTime(data)))
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
        <Link href={`/nft/${data.token_id}`}>
          <a>
            <div className={styles.imageContent}>
              {data.asset_type.includes('video') ? (
                viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? (
                  <div className="w-full relative flex justify-center items-center rounded-[24px] overflow-hidden">
                    {play ? (
                      <div
                        className="w-full h-full absolute"
                        dangerouslySetInnerHTML={{
                          __html: `<video autoplay loop muted webkit-playsinline playsinline class="w-full h-full object-cover rounded-[24px] overflow-hidden">
              <source src=${data.asset_url} type="video/mp4" /></video>`,
                        }}
                      />
                    ) : data.cover_image_url != null && data.cover_image_url !== '' ? (
                      <ImageWithFallback
                        src={data.cover_image_url}
                        layout="fill"
                        alt=""
                        className="w-full h-full rounded-[24px] object-cover"
                      />
                    ) : (
                      <Image src={DefaultNftBG} alt="" layout="fill" className="w-full h-full object-cover" />
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
                    className="w-full"
                    dangerouslySetInnerHTML={{
                      __html: `<video autoplay loop muted webkit-playsinline playsinline class="w-full h-full object-cover rounded-[24px] overflow-hidden">
                <source src=${data.asset_url} type="video/mp4" /></video>`,
                    }}
                  />
                )
              ) : data.asset_type.includes('audio') ? (
                <div className="w-full h-full">
                  {!loaded && (
                    <ReactPlaceholder showLoadingAnimation={true} type="rect" ready={false} color="#202427">
                      <div></div>
                    </ReactPlaceholder>
                  )}
                  <Image
                    src={data.cover_image_url}
                    alt=""
                    layout="fill"
                    className="w-full h-full rounded-[24px] object-cover"
                    onLoadingComplete={() => setLoaded(true)}
                  />
                </div>
              ) : (
                <ImageWithFallback
                  src={data.asset_url}
                  layout="fill"
                  alt=""
                  className="w-full h-full rounded-[24px] object-cover"
                />
              )}
            </div>
          </a>
        </Link>
        {data.artist_profile_picture !== null && data.artist_profile_picture.length > 0 && (
          <div
            className={styles.avatar}
            onClick={() => {
              router.push(`/${data.artist_username}`)
              dispatch({ type: 'set', isLoading: true })
            }}
          >
            <div className="w-[28px] h-[28px] lg:w-[46px] lg:h-[46px] rounded-full overflow-hidden">
              <img
                width={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 28 : 46}
                height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 28 : 46}
                src={data.artist_profile_picture}
                alt=""
                className="rounded-full"
              />
            </div>
          </div>
        )}
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
