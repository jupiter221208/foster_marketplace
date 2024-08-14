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
  // useEffect(() => {
  //   if (startTime !== undefined && startTime !== null && endTime !== undefined && endTime !== null) {
  //     setTimeLeft(calculateTimeLeft(getStartTime()))
  //     const timer = setInterval(() => {
  //       let time_left = calculateTimeLeft(getStartTime())
  //       setTimeLeft(time_left)
  //     }, 1000)

  //     return () => {
  //       clearTimeout(timer)
  //     }
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [startTime, endTime])

  // const getStartTime = () => {
  //   let startDate = new Date(startTime)
  //   let proposalStartTime = startDate.getTime()
  //   let difference = proposalStartTime - new Date().getTime()

  //   if (difference >= 0) {
  //     setAuctionStarted(false)
  //     return startTime
  //   } else {
  //     setIsStarted(true)
  //     setAuctionStarted(true)

  //     let endDate = new Date(endTime)
  //     let proposalEndTime = endDate.getTime()
  //     let end_difference = proposalEndTime - new Date().getTime()
  //     if (end_difference < 0) setIsEnded(true)
  //     return endTime
  //   }
  // }

  return (
    <div className={styles.container}>
      <div className="block justify-center items-start">
        <div className="flex justify-start lg:justify-center gap-[3px] mt-[2px] lg:mt-[8px] items-center">
          <div className={styles.highestBid}>{currentPrice > 0 ? 'Highest Bid' : 'Reserve Price'}</div>
          <div className="flex items-center mt-[4px] ml-[10px]">
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
