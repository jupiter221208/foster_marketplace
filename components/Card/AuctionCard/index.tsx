import React, { useEffect, useState } from 'react'

// next components
import Image from 'next/image'

// images and icons
import SolanaLogoIcon from 'assets/icons/solana-logo-dark.svg?component'
import SolanaLogoMobileIcon from 'assets/icons/solana-logo-dark-small.svg?component'
import ClockSandIcon from 'assets/icons/clock-sand-icon.svg?component'

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
        let time_left = calculateTimeLeft(getStartTime())
        setTimeLeft(time_left)
      }, 1000)

      return () => {
        clearTimeout(timer)
      }
    }
  }, [startTime, endTime])

  const getStartTime = () => {
    let startDate = new Date(startTime)
    let proposalStartTime = startDate.getTime()
    let difference = proposalStartTime - new Date().getTime()

    if (difference >= 0) {
      setAuctionStarted(false)
      return startTime
    } else {
      setIsStarted(true)
      setAuctionStarted(true)

      let endDate = new Date(endTime)
      let proposalEndTime = endDate.getTime()
      let end_difference = proposalEndTime - new Date().getTime()
      if (end_difference < 0) setIsEnded(true)
      return endTime
    }
  }

  return (
    <div className={styles.container}>
      <div className="block justify-center items-start">
        <div className="flex justify-around items-center gap-[6px] mt-1 lg:mt-[8px] ml-[2px]">
          {auctionStarted === true ? (
            <div className="flex gap-[6px] items-center">
              <div className={styles.whiteText}>Ends&nbsp;in</div>
            </div>
          ) : (
            <div className={styles.whiteText}>Starts&nbsp;in</div>
          )}
          <div className="hidden lg:flex items-center gap-[4px]">
            {timeLeft && timeLeft['days'] !== '00' && (
              <div className="flex block justify-center">
                <div className={styles.grayText}>{timeLeft['days']}</div>
                <div className={styles.grayText}>d</div>
              </div>
            )}
            {timeLeft && timeLeft['hours'] !== '00' && (
              <div className="flex block justify-center">
                <div className={styles.grayText}>{timeLeft['hours']}</div>
                <div className={styles.grayText}>h</div>
              </div>
            )}

            {timeLeft && timeLeft['minutes'] !== '00' && (
              <div className="flex block justify-center ">
                <div className={styles.grayText}>{timeLeft && timeLeft['minutes']}</div>
                <div className={styles.grayText}>m</div>
              </div>
            )}
            {timeLeft && timeLeft['seconds'] !== '00' && (
              <div className="flex block justify-center ">
                <div className={styles.grayText}>{timeLeft && timeLeft['seconds']}</div>
                <div className={styles.grayText}>s</div>
              </div>
            )}
          </div>
          <div className="flex lg:hidden items-center">
            {timeLeft && timeLeft['days'] !== '00' && (
              <div className="flex block justify-center">
                <div className={styles.grayText}>{timeLeft['days']}:</div>
              </div>
            )}
            {timeLeft && (
              <div className="flex block justify-center">
                <div className={styles.grayText}>{timeLeft['hours']}:</div>
              </div>
            )}
            {timeLeft && (
              <div className="flex block justify-center ">
                <div className={styles.grayText}>{timeLeft['minutes']}:</div>
              </div>
            )}
            {timeLeft && (
              <div className="flex block justify-center ">
                <div className={styles.grayText}>{timeLeft['seconds']}</div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="block justify-center items-start">
        <div className="flex justify-start lg:justify-center gap-[3px] mt-[2px] lg:mt-[8px] items-center">
          <div className="flex items-center mt-[4px]">
            <SolanaLogoMobileIcon alt="" />
          </div>
          <div className={styles.whiteText}>
            {Math.round((currentPrice > 0 ? currentPrice : reservePrice) * 1000) / 1000}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuctionCard
