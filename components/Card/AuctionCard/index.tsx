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
  const [auctionStarted, setAuctionStarted] = useState(null)
  const viewport = useViewport()

  useEffect(() => {
    if (startTime !== undefined && startTime !== null && endTime !== undefined && endTime !== null) {
      setTimeLeft(calculateTimeLeft(getStartTime()))

      const timer = setInterval(() => {
        setTimeLeft(calculateTimeLeft(getStartTime()))
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [startTime, endTime])

  const getStartTime = () => {
    let startDate = new Date(startTime)
    let offset = startDate.getTimezoneOffset() * 60 * 1000
    let proposalStartTime = startDate.getTime() - offset

    let difference = proposalStartTime - new Date().getTime()

    if (difference >= 0) {
      setAuctionStarted(false)
      return startTime
    } else {
      setIsStarted(true)
      setAuctionStarted(true)

      let endDate = new Date(endTime)
      let offsetEnd = endDate.getTimezoneOffset() * 60 * 1000
      let proposalEndTime = endDate.getTime() - offsetEnd

      let end_difference = proposalEndTime - new Date().getTime()
      if (end_difference < 0) setIsEnded(true)
      return endTime
    }
  }

  return (
    <div className={styles.container}>
      <div className="block justify-center items-start">
        <div className="flex justify-around gap-2 mt-1">
          <div className={styles.grayText}>
            {auctionStarted === true ? 'Ends in' : auctionStarted === false ? 'Starts in' : ''}
          </div>

          <div className="flex block justify-center gap-[2px]">
            <div className={styles.whiteText}>{timeLeft && timeLeft['days']}</div>
            <div className={styles.grayText}>d</div>
          </div>
          <div className="flex block justify-center gap-[2px]">
            <div className={styles.whiteText}>{timeLeft && timeLeft['hours']}</div>
            <div className={styles.grayText}>h</div>
          </div>
          <div className="flex block justify-center gap-[2px]">
            <div className={styles.whiteText}>{timeLeft && timeLeft['minutes']}</div>
            <div className={styles.grayText}>m</div>
          </div>
          <div className="flex block justify-center gap-[2px]">
            <div className={styles.whiteText}>{timeLeft && timeLeft['seconds']}</div>
            <div className={styles.grayText}>s</div>
          </div>
        </div>
      </div>
      <div className="block justify-center items-start">
        <div className="flex justify-start lg:justify-center gap-1 mt-[2px] lg:mt-[2px] items-center">
          <div className="w-3 h-4 lg:w-5 lg:h-[25px] flex items-center">
            {viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? (
              <SolanaLogoMobileIcon alt="" />
            ) : (
              <SolanaLogoIcon alt="" />
            )}
          </div>
          <div className={styles.priceText}>
            {Math.round((auctionStarted && currentPrice > 0 ? currentPrice : reservePrice) * 1000) / 1000}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuctionCard
