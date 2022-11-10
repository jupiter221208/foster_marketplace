import React, { useEffect, useState } from 'react'

// next components
import Image from 'next/image'

// images and icons
import SolanaLogoIcon from 'assets/icons/solana-logo.svg'

// styles
import styles from './index.module.scss'

const AuctionCard = (props) => {
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
      
      if(s <= 0) {
        setIsStarted(true)
      }

      const t = end.getTime() - now.getTime()
      if(t < 0) {
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
        seconds
      })
    }

    let internalID

    if(startTime && endTime) {
      if(internalID) clearInterval(internalID)
      internalID = setInterval(setCountDown, 1000)
      const now = new Date()
      const t = endTime.getTime() - now.getTime()
      if(t < 0) {
        clearInterval(internalID)
      }
    }

  }, [startTime, endTime])

  // useEffect(() => {
  //   let count = 0
  //   const auctionEndTime = new Date(endTime)
  //   if (auctionEndTime !== (0 as unknown as Date) && now !== 0) {
  //     setInterval(() => {
  //       let obj: any = {}
  //       let delta = Math.abs(auctionEndTime.getTime() - now - count * 1000) / 1000
  //       let days = Math.floor(delta / 86400)
  //       obj.days = days
  //       delta -= days * 86400
  //       let hours = Math.floor(delta / 3600) % 24
  //       obj.hours = hours
  //       delta -= hours * 3600
  //       let minutes = Math.floor(delta / 60) % 60
  //       obj.minutes = minutes
  //       delta -= minutes * 60
  //       let seconds = Math.floor(delta % 60)
  //       obj.seconds = seconds
  //       let temp: any = {}
  //       if (obj.days > 9) {
  //         temp.days = obj.days.toString()
  //       } else {
  //         temp.days = '0' + obj.days.toString()
  //       }
  //       if (obj.hours > 9) {
  //         temp.hours = obj.hours.toString()
  //       } else {
  //         temp.hours = '0' + obj.hours.toString()
  //       }
  //       if (obj.minutes > 9) {
  //         temp.minutes = obj.minutes.toString()
  //       } else {
  //         temp.minutes = '0' + obj.minutes.toString()
  //       }
  //       if (obj.seconds > 9) {
  //         temp.seconds = obj.seconds.toString()
  //       } else {
  //         temp.seconds = '0' + obj.seconds.toString()
  //       }
  //       setDisplayEndTime(temp)
  //       count++
  //     }, 1000)
  //   }
  // }, [now])

  return (
    <div className={styles.container}>
      <div className="block justify-center items-start">
        <div className={styles.whiteText}>Starting Bid</div>
        <div className="flex justify-center gap-1 mt-1">
          <div className="w-4 h-4 lg:w-6 lg:h-6">
            <Image src={SolanaLogoIcon} alt="" />
          </div>
          <div className={styles.greenText}>{reservePrice}</div>
        </div>
      </div>
      <div className="block justify-center items-start">
        <div className={styles.whiteText}>Current Bid</div>
        <div className="flex justify-center gap-1 mt-1">
          <div className="w-4 h-4 lg:w-6 lg:h-6">
            <Image src={SolanaLogoIcon} alt="" />
          </div>
          <div className={styles.greenText}>{currentPrice}</div>
        </div>
      </div>
      <div className="block justify-center items-start">
        <div className={styles.whiteText}>Ends In</div>
        <div className="flex justify-around gap-1">
          <div className="block justify-center">
            <div className={styles.greenText}>
              {/* {displayEndTime.hours[0]}
              {displayEndTime.hours[1]} */}
              {displayEndTime.days}
            </div>
            <div className={styles.grayText}>Days</div>
          </div>
          <div className="block justify-center">
            <div className={styles.greenText}>
              {/* {displayEndTime.hours[0]}
              {displayEndTime.hours[1]} */}
              {displayEndTime.hours}
            </div>
            <div className={styles.grayText}>Hours</div>
          </div>
          <div className="block justify-center">
            <div className={styles.greenText}>
              {/* {displayEndTime.minutes[0]}
              {displayEndTime.minutes[1]} */}
              {displayEndTime.minutes}
            </div>
            <div className={styles.grayText}>Min</div>
          </div>
          <div className="block justify-center">
            <div className={styles.greenText}>
              {/* {displayEndTime.seconds[0]}
              {displayEndTime.seconds[1]} */}
              {displayEndTime.seconds}
            </div>
            <div className={styles.grayText}>Sec</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuctionCard
