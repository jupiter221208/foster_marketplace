import React, { useEffect, useState } from 'react'

// next components
import Image from 'next/image'

// images and icons
import SolanaLogoIcon from 'assets/icons/solana-logo-dark.svg?component'
import SolanaLogoMobileIcon from 'assets/icons/solana-logo-dark-small.svg?component'

// styles
import styles from './index.module.scss'

import { calculateTimeLeft } from 'utils/helpers'
import { useViewport } from 'utils'

const AuctionCard = props => {
  const { currentPrice, reservePrice, endTime, startTime, setIsEnded, setIsStarted } = props
  const [timeLeft, setTimeLeft] = useState(null)
  const [auctionStarted, setAuctionStarted] = useState(true)
  const viewport = useViewport()

  useEffect(() => {
    if (startTime !== undefined && startTime !== null && endTime !== undefined && endTime !== null) {
      setTimeLeft(calculateTimeLeft(getStartTime() * 1000))

      const timer = setInterval(() => {
        setTimeLeft(calculateTimeLeft(getStartTime() * 1000))
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [startTime, endTime])

  const getStartTime = () => {
    let difference = Number(startTime) * 1000 - +new Date()
    if (difference >= 0) {
      setAuctionStarted(false)
      return Number(startTime)
    } else {
      setIsStarted(true)
      setAuctionStarted(true)

      let end_difference = Number(endTime) * 1000 - +new Date()
      if (end_difference < 0) setIsEnded(true)
      return Number(endTime)
    }
  }
  return (
    <div className={styles.container}>
      <div className="block justify-center items-start">
        <div className={styles.thinGreenText}>{auctionStarted ? 'STARTING' : 'RESERVE PRICE'}</div>
        <div className="flex justify-center gap-1 mt-2 items-center">
          <div className="w-3 h-4 lg:w-5 lg:h-5 flex items-center">
            {viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? (
              <SolanaLogoMobileIcon alt="" />
            ) : (
              <SolanaLogoIcon alt="" />
            )}
          </div>
          <div className={styles.whiteText}>{Math.round(reservePrice * 1000) / 1000}</div>
        </div>
      </div>
      {auctionStarted && (
        <div className="block justify-center items-start">
          <div className={styles.thinGreenText}>CURRENT</div>
          <div className="flex justify-center gap-1 mt-2 items-center">
            <div className="w-3 h-4 lg:w-5 lg:h-5 flex items-center">
              {viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? (
                <SolanaLogoMobileIcon alt="" />
              ) : (
                <SolanaLogoIcon alt="" />
              )}
            </div>
            <div className={styles.whiteText}>{Math.round(currentPrice * 1000) / 1000}</div>
          </div>
        </div>
      )}
      <div className="block justify-center items-start">
        <div className={styles.thinGreenText}>{auctionStarted ? 'TIME REMAINING' : 'AUCTION STARTS IN'}</div>
        <div className="flex justify-around gap-1 mt-1">
          <div className="block justify-center">
            <div className={styles.whiteText}>{timeLeft && timeLeft['days']}</div>
            <div className={styles.grayText}>&nbsp;Days&nbsp;</div>
          </div>
          <div className="block justify-center">
            <div className={styles.whiteText}>{timeLeft && timeLeft['hours']}</div>
            <div className={styles.grayText}>&nbsp;&nbsp;Hours&nbsp;&nbsp;</div>
          </div>
          <div className="block justify-center">
            <div className={styles.whiteText}>{timeLeft && timeLeft['minutes']}</div>
            <div className={styles.grayText}>Minutes</div>
          </div>
          <div className="block justify-center">
            <div className={styles.whiteText}>{timeLeft && timeLeft['seconds']}</div>
            <div className={styles.grayText}>Seconds</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuctionCard
