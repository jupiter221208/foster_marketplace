import React, { useEffect, useState } from 'react'

// next components
import Image from 'next/image'

// images and icons
import SolanaLogoIcon from 'assets/icons/solana-logo.svg'

// styles
import styles from './index.module.scss'

const AuctionCard = props => {
  const { currentPrice, reservePrice, endTime, startTime, setIsEnded, setIsStarted } = props
  const [displayEndTime, setDisplayEndTime] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const setCountDown = () => {
      const now = new Date()
      const start = startTime
      const end = endTime

      const s = start.getTime() - now.getTime()

      if (s <= 0) {
        setIsStarted(true)
      }

      const t = end.getTime() - now.getTime()
      if (t < 0) {
        setDisplayEndTime({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        })
        setIsEnded(true)
        return
      }
      const days = Math.floor(t / (1000 * 60 * 60 * 24))
      const hours = Math.floor((t % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((t % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((t % (1000 * 60)) / 1000)
      setDisplayEndTime({
        days,
        hours,
        minutes,
        seconds,
      })
    }

    let internalID

    if (startTime && endTime) {
      if (internalID) clearInterval(internalID)
      internalID = setInterval(setCountDown, 1000)
      const now = new Date()
      const t = endTime.getTime() - now.getTime()
      if (t < 0) {
        clearInterval(internalID)
      }
    }
  }, [startTime, endTime])

  return (
    <div className={styles.container}>
      <div className="block justify-center items-start">
        <div className={styles.thinGreenText}>STARTING BID</div>
        <div className="flex justify-center gap-1 mt-2">
          <div className="w-4 h-4 lg:w-6 lg:h-6">
            <Image src={SolanaLogoIcon} alt="" />
          </div>
          <div className={styles.whiteText}>{reservePrice}</div>
        </div>
      </div>
      <div className="block justify-center items-start">
        <div className={styles.thinGreenText}>CURRENT BID</div>
        <div className="flex justify-center gap-1 mt-2">
          <div className="w-4 h-4 lg:w-6 lg:h-6">
            <Image src={SolanaLogoIcon} alt="" />
          </div>
          <div className={styles.whiteText}>{currentPrice}</div>
        </div>
      </div>
      <div className="block justify-center items-start">
        <div className={styles.thinGreenText}>TIME REMAINING</div>
        <div className="flex justify-around gap-1 mt-1">
          <div className="block justify-center">
            <div className={styles.whiteText}>{displayEndTime.days}</div>
            <div className={styles.grayText}>&nbsp;Days&nbsp;</div>
          </div>
          <div className="block justify-center">
            <div className={styles.whiteText}>{displayEndTime.hours}</div>
            <div className={styles.grayText}>&nbsp;&nbsp;Hours&nbsp;&nbsp;</div>
          </div>
          <div className="block justify-center">
            <div className={styles.whiteText}>{displayEndTime.minutes}</div>
            <div className={styles.grayText}>Minutes</div>
          </div>
          <div className="block justify-center">
            <div className={styles.whiteText}>{displayEndTime.seconds}</div>
            <div className={styles.grayText}>Seconds</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuctionCard
