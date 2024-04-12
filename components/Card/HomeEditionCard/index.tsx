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
import ClockSandIcon from 'assets/icons/clock-sand-icon.svg?component'

// styles
import styles from './index.module.scss'
import ImageWithFoster from 'components/ImageWithFoster'
import { getDisplayUserName, getPriceValue } from 'utils/strings'
import { calculateAuctionTimeLeft, getTimeDifference } from 'utils/helpers'

const HomeEditionCard = props => {
  const { data, type = 'limit', onClick } = props
  const viewport = useViewport()
  const [play, setPlay] = useState(false)
  const [timeLeft, setTimeLeft] = useState(null)

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

  useEffect(() => {
    if (data.endTime !== undefined && data.endTime !== null) {
      setTimeLeft(calculateAuctionTimeLeft(data.endTime))

      const timer = setInterval(() => {
        setTimeLeft(calculateAuctionTimeLeft(data.endTime))
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [data.endTime])

  return (
    <div className={styles.layout}>
      <div className={styles.container}>
        {data.endTime !== null && data.startTime !== data.endTime ? (
          <div className={styles.timeSection}>
            <ClockSandIcon />

            <div className="flex items-center gap-[2px]">
              {timeLeft && timeLeft['days'] !== '00' && (
                <div>
                  <div className={styles.endTime}>
                    {timeLeft && timeLeft['days']}
                    <div className={styles.bidDesc}>d</div>
                  </div>
                </div>
              )}
              <div className={styles.endTimeContainer}>
                <div className={styles.endTime}>
                  {timeLeft && timeLeft['hours']}
                  <div className={styles.bidDesc}>h</div>
                </div>
              </div>
              <div className={styles.endTimeContainer}>
                <div className={styles.endTime}>
                  {timeLeft && timeLeft['minutes']}
                  <div className={styles.bidDesc}>m</div>
                </div>
              </div>
              <div className={styles.endTimeContainer}>
                <div className={styles.endTime}>
                  {timeLeft && timeLeft['seconds']}
                  <div className={styles.bidDesc}>s</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.topSection} />
        )}
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
                <img src={DefaultAvatar.src} className="w-[45px]  h-[45px] rounded-full" />
              ) : (
                <img src={data?.artistProfilePicture} onClick={() => {}} className="w-[45px] h-[45px] rounded-full" />
              )}
            </a>
          </Link>
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
                  <div className={styles.bidCount}>
                    {data.maxSupply - data.currentSupply + '/' + data.maxSupply + ' left'}
                  </div>
                ) : (
                  <div className={styles.bidCount}>{data.currentSupply + ' sold'}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomeEditionCard
