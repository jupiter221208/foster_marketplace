import React, { useState, useEffect } from 'react'

// next components
import Image from 'next/image'

// custom functions
import { useViewport } from 'utils'
import { calculateTimeLeft } from 'utils/helpers'

// images and icons
import SolanaLogoIcon from 'assets/icons/solana-logo.svg'

// styles
import styles from './index.module.scss'

const LiveAuctionCard = props => {
  const { data, onClick } = props

  const viewport = useViewport()
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(Number(data.end_time) * 1000))

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft(Number(data.end_time) * 1000))
    }, 1000)

    return () => clearTimeout(timer)
  })

  return (
    <div className={styles.container} onClick={() => onClick()}>
      <div className={styles.imageArea}>
        <div className={styles.imageContent}>
          {data.asset_type === 'video' ? (
            <div
              dangerouslySetInnerHTML={{
                __html: `<video autoplay loop muted webkit-playsinline playsinline class="w-full h-full object-cover rounded-[10px] lg:rounded-[24px] overflow-hidden">
                <source src=${data.asset_url} type="video/mp4" /></video>`,
              }}
              onClick={() => onClick()}
            />
          ) : (
            <img src={data.asset_url} alt="" className="w-full h-full rounded-[10px] lg:rounded-[24px] object-cover" />
          )}
        </div>
      </div>
      <div className="w-full flex flex-wrap justify-center items-center px-[9px]">
        <div className="w-full flex justify-between items-center">
          <div className={styles.nftName}>{data.nft_name}</div>
        </div>
        <div className="w-full flex items-center">
          <div className={styles.artistName}>{data.artist_username}</div>
          {/* <div className="pl-[6px] flex items-center">
            <Image
              src={CheckedGreenIcon}
              alt=""
              width={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 12 : 22}
              height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 12 : 22}
            />
          </div> */}
        </div>
      </div>
      <div className={styles.bidContainer}>
        <div className="w-full flex flex-wrap justify-between">
          <div>
            <div className={styles.bidName}>{data.current_bid !== null ? 'CURRENT BID' : 'STARTING BID'}</div>
            <div className={styles.bidCountContainer}>
              <Image
                src={SolanaLogoIcon}
                alt=""
                width={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 10 : viewport === 'xl' ? 18 : 23}
                height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 10 : viewport === 'xl' ? 18 : 23}
              />
              <div className={styles.bidCount}>{data.current_bid !== null ? data.current_bid : data.reserve_price}</div>
            </div>
            {/* <div className={styles.bidDesc}>Reserve Met</div> */}
          </div>

          <div>
            <div className={styles.bidName}>TIME REMAINING</div>
            <div className="flex justify-center">
              <div>
                <div className={styles.endTime}>
                  <>{timeLeft['days']}</>
                </div>
                <div className={styles.bidDesc}>Day</div>
              </div>
              <div className={styles.endTimeContainer}>
                <div className={styles.endTime}>
                  <>{timeLeft['hours']}</>
                </div>
                <div className={styles.bidDesc}>Hour</div>
              </div>
              <div className={styles.endTimeContainer}>
                <div className={styles.endTime}>
                  <>{timeLeft['minutes']}</>
                </div>
                <div className={styles.bidDesc}>Min</div>
              </div>
              {viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? (
                <></>
              ) : (
                <div className={styles.endTimeContainer}>
                  <div className={styles.endTime}>
                    <>{timeLeft['seconds']}</>
                  </div>
                  <div className={styles.bidDesc}>Sec</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LiveAuctionCard
