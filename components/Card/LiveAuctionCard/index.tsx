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
import CheckedGreenIcon from 'assets/icons/checked-green.svg'

const LiveAuctionCard = props => {
  const { image, nftName, artistName, count, endsIn, onClick } = props
  const viewport = useViewport()
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(endsIn))

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft(endsIn))
    }, 60000)

    return () => clearTimeout(timer)
  })

  return (
    <div className={styles.container} onClick={() => onClick()}>
      <div className={styles.imageArea}>
        <div className={styles.imageContent}>
          <img src={image} alt="" className="w-full h-full rounded-[10px] lg:rounded-[24px] object-contain" />
        </div>
      </div>
      <div className="w-full mt-[10px] flex flex-wrap justify-center items-center px-[9px]">
        <div className="w-full flex justify-between items-center">
          <div className={styles.nftName}>{nftName}</div>
        </div>
        <div className="w-full flex items-center mt-[2px] lg:mt-[4px]">
          <div className={styles.artistName}>{artistName}</div>
          <div className="pl-[6px] flex items-center">
            <Image
              src={CheckedGreenIcon}
              alt=""
              width={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 12 : 22}
              height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 12 : 22}
            />
          </div>
        </div>
      </div>
      <div className={styles.bidContainer}>
        <div className="w-full flex flex-wrap justify-between">
          <div>
            <div className={styles.bidName}>Current Bid</div>
            <div className={styles.bidCountContainer}>
              <Image
                src={SolanaLogoIcon}
                alt=""
                width={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 12 : viewport === 'xl' ? 18 : 23}
                height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 12 : viewport === 'xl' ? 18 : 23}
              />
              <div className={styles.bidCount}>{count}</div>
            </div>
            <div className={styles.bidDesc}>Reserve Met</div>
          </div>

          <div>
            <div className={styles.endsIn}>Ends In</div>
            <div className="flex justify-center mt-[2px]">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LiveAuctionCard
