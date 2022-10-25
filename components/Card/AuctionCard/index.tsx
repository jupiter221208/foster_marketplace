import React, { useEffect, useState } from 'react'

// next components
import Image from 'next/image'

// images and icons
import SolanaLogoIcon from 'assets/icons/solana-logo.svg'

// styles
import styles from './index.module.scss'

const AuctionCard = () => {
  const [now, setNow] = useState(0)
  const [displayEndTime, setDisplayEndTime] = useState({
    days: '',
    hours: '',
    minutes: '',
    seconds: '',
  })

  useEffect(() => {
    setNow(Date.now())
  }, [])

  useEffect(() => {
    let count = 0
    const auctionEndTime = new Date('2022-10-10')
    if (auctionEndTime !== (0 as unknown as Date) && now !== 0) {
      setInterval(() => {
        let obj: any = {}
        let delta = Math.abs(auctionEndTime.getTime() - now - count * 1000) / 1000
        let days = Math.floor(delta / 86400)
        obj.days = days
        delta -= days * 86400
        let hours = Math.floor(delta / 3600) % 24
        obj.hours = hours
        delta -= hours * 3600
        let minutes = Math.floor(delta / 60) % 60
        obj.minutes = minutes
        delta -= minutes * 60
        let seconds = Math.floor(delta % 60)
        obj.seconds = seconds
        let temp: any = {}
        if (obj.days > 9) {
          temp.days = obj.days.toString()
        } else {
          temp.days = '0' + obj.days.toString()
        }
        if (obj.hours > 9) {
          temp.hours = obj.hours.toString()
        } else {
          temp.hours = '0' + obj.hours.toString()
        }
        if (obj.minutes > 9) {
          temp.minutes = obj.minutes.toString()
        } else {
          temp.minutes = '0' + obj.minutes.toString()
        }
        if (obj.seconds > 9) {
          temp.seconds = obj.seconds.toString()
        } else {
          temp.seconds = '0' + obj.seconds.toString()
        }
        setDisplayEndTime(temp)
        count++
      }, 1000)
    }
  }, [now])

  return (
    <div className={styles.container}>
      <div className="block justify-center items-start">
        <div className={styles.whiteText}>Starting Bid</div>
        <div className="flex justify-center gap-1 mt-1">
          <div className="w-4 h-4 lg:w-6 lg:h-6">
            <Image src={SolanaLogoIcon} alt="" />
          </div>
          <div className={styles.greenText}>12</div>
        </div>
      </div>
      <div className="block justify-center items-start">
        <div className={styles.whiteText}>Current Bid</div>
        <div className="flex justify-center gap-1 mt-1">
          <div className="w-4 h-4 lg:w-6 lg:h-6">
            <Image src={SolanaLogoIcon} alt="" />
          </div>
          <div className={styles.greenText}>12</div>
        </div>
      </div>
      <div className="block justify-center items-start">
        <div className={styles.whiteText}>Ends In</div>
        <div className="flex justify-around gap-1">
          <div className="block justify-center">
            <div className={styles.greenText}>
              {displayEndTime.hours[0]}
              {displayEndTime.hours[1]}
            </div>
            <div className={styles.grayText}>Hours</div>
          </div>
          <div className="block justify-center">
            <div className={styles.greenText}>
              {displayEndTime.minutes[0]}
              {displayEndTime.minutes[1]}
            </div>
            <div className={styles.grayText}>Min</div>
          </div>
          <div className="block justify-center">
            <div className={styles.greenText}>
              {displayEndTime.seconds[0]}
              {displayEndTime.seconds[1]}
            </div>
            <div className={styles.grayText}>Sec</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuctionCard
