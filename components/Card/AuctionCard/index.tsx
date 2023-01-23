import React, { useEffect, useState } from 'react'

// next components
import Image from 'next/image'

// images and icons
import SolanaLogoIcon from 'assets/icons/solana-logo.svg'

// styles
import styles from './index.module.scss'

import { calculateTimeLeft } from 'utils/helpers'

const AuctionCard = props => {
  const { currentPrice, reservePrice, endTime, startTime, setIsEnded, setIsStarted } = props
  const [timeLeft, setTimeLeft] = useState(null)
  const [auctionStarted, setAuctionStarted] = useState(true)

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
      setAuctionStarted(true)
      return Number(endTime)
    }
  }
  return (
    <div className={styles.container}>
      <div className="block justify-center items-start">
        <div className={styles.thinGreenText}>{auctionStarted ? 'STARTING' : 'RESERVE PRICE'}</div>
        <div className="flex justify-center gap-1 mt-2">
          <div className="w-4 h-4 lg:w-6 lg:h-6">
            <Image src={SolanaLogoIcon} alt="" />
          </div>
          <div className={styles.whiteText}>{reservePrice}</div>
        </div>
      </div>
      {auctionStarted && (
        <div className="block justify-center items-start">
          <div className={styles.thinGreenText}>CURRENT</div>
          <div className="flex justify-center gap-1 mt-2">
            <div className="w-4 h-4 lg:w-6 lg:h-6">
              <Image src={SolanaLogoIcon} alt="" />
            </div>
            <div className={styles.whiteText}>{currentPrice}</div>
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
