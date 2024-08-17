import React, { useState, useEffect } from 'react'

import Link from 'next/link'
// components

// utilies
import { getDisplayUserName } from 'utils/strings'
import { calculateAuctionTimeLeft, calculateTimeLeft } from 'utils/helpers'

// resources

// styles
import styles from './index.module.scss'

import ImageWithFoster from 'components/ImageWithFoster'

const NFTCreatorDataSection = props => {
  const {
    nftName,
    nftCreatorname,
    nftOwnerUsername,
    nftCollectionAddress,
    nftCollectionName,
    nftCollectionImage,
    liveAuction,
    isEditionListing,
    endTime,
    startTime,
    endEditionTime,
    startEditionTime,
    setIsEnded,
    setIsStarted,
    nameLoading,
    profileImage,
  } = props

  const [timeLeft, setTimeLeft] = useState(null)
  const [auctionStarted, setAuctionStarted] = useState(null)

  useEffect(() => {
    if (
      !liveAuction &&
      isEditionListing &&
      startTime !== undefined &&
      startTime !== null &&
      endTime !== undefined &&
      endTime !== null
    ) {
      setTimeLeft(calculateTimeLeft(getStartTime()))
      const timer = setInterval(() => {
        let time_left = calculateTimeLeft(getStartTime())
        setTimeLeft(time_left)
      }, 1000)

      return () => {
        clearTimeout(timer)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startTime, endTime])

  useEffect(() => {
    if (
      startEditionTime !== undefined &&
      startEditionTime !== null &&
      endEditionTime !== undefined &&
      endEditionTime !== null
    ) {
      let time = getStartEditionTime()
      if (!time) return
      setTimeLeft(calculateAuctionTimeLeft(time))
      const timer = setInterval(() => {
        let time1 = getStartEditionTime()
        if (!time1) {
          setTimeLeft(null)
          return
        }
        let time_left = calculateAuctionTimeLeft(time1)
        setTimeLeft(time_left)
      }, 1000)

      return () => {
        clearTimeout(timer)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startEditionTime, endEditionTime])

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
      if (end_difference < 0) {
        setIsEnded(true)
        return null
      }
      return endTime
    }
  }

  const getStartEditionTime = () => {
    let startDate = new Date(startEditionTime)
    let offset = startDate.getTimezoneOffset() * 60 * 1000
    let proposalStartTime = startDate.getTime() - offset
    let difference = proposalStartTime - new Date().getTime()

    if (difference >= 0) {
      setAuctionStarted(false)
      return startTime
    } else {
      setIsStarted(true)
      setAuctionStarted(true)

      let endDate = new Date(endEditionTime)
      let offset = startDate.getTimezoneOffset() * 60 * 1000
      let proposalEndTime = endDate.getTime() - offset
      let end_difference = proposalEndTime - new Date().getTime()
      if (end_difference < 0) {
        setIsEnded(true)
        return null
      }
      return endEditionTime
    }
  }

  const isExpired = time => {
    if (time['days'] === '00' && time['hours'] === '00' && time['minutes'] === '00' && time['seconds'] === '00')
      return true
    return false
  }

  return (
    <div>
      <>
        <div className="mt-[30px] flex gap-[30px] flex-wrap">
          <Link href={`/${nftCreatorname}`} passHref>
            <a>
              <div>
                <div className={styles.creator}>Creator</div>
                <div className={styles.userTile}>
                  <div className="flex gap-[6px] items-center">
                    <div className="w-[30px] h-[30px] rounded-full overflow-hidden">
                      <ImageWithFoster src={profileImage} width={60} className="w-full h-full object-cover" />
                    </div>
                    <div className={styles.username}>{getDisplayUserName(nftCreatorname)}</div>
                  </div>
                </div>
              </div>
            </a>
          </Link>

          {nftCollectionAddress && (
            <Link href={`/collection/${nftCollectionAddress}`} passHref>
              <a>
                <div>
                  <div className={styles.creator}>Collection</div>
                  <div className={styles.userTile}>
                    <div className="flex gap-[6px] items-center">
                      <div className="min-w-[30px] w-[30px] h-[30px] rounded-full overflow-hidden">
                        <ImageWithFoster src={nftCollectionImage} width={60} className="w-full h-full object-cover" />
                      </div>
                      <div className={styles.username}>{getDisplayUserName(nftCollectionName)}</div>
                    </div>
                  </div>
                </div>
              </a>
            </Link>
          )}
          {timeLeft && !isExpired(timeLeft) && !liveAuction && isEditionListing && (
            <div>
              <div className={styles.creator}>{auctionStarted === true ? 'Time Remaining' : 'Starts In'}</div>
              <div>
                <div className={styles.userTile}>
                  <div className={`${styles.bidCountContainer} pl-[12px] mt-[-1px]`}>
                    {timeLeft && timeLeft['days'] !== '00' && (
                      <div>
                        <div className={styles.endTime}>
                          {timeLeft && timeLeft['days']}
                          {timeLeft && <div className={styles.bidDesc}>d</div>}
                        </div>
                      </div>
                    )}
                    <div className={styles.endTimeContainer}>
                      <div className={styles.endTime}>
                        {timeLeft && timeLeft['hours']}
                        {timeLeft && <div className={styles.bidDesc}>h</div>}
                      </div>
                    </div>
                    <div className={styles.endTimeContainer}>
                      <div className={styles.endTime}>
                        {timeLeft && timeLeft['minutes']}
                        {timeLeft && <div className={styles.bidDesc}>m</div>}
                      </div>
                    </div>
                    <div className={styles.endTimeContainer}>
                      <div className={styles.endTime}>
                        {timeLeft && timeLeft['seconds']}
                        {timeLeft && <div className={styles.bidDesc}>s</div>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        {/* <div className="w-full flex flex-wrap mt-[9px] lg:mt-[6px] gap-x-[14px] lg:gap-x-[34px]">
            <div className="flex gap-1 lg:gap-2">
              <div className={styles.grayText}>Created by</div>
              <Link href={`/${nftCreatorname}`} passHref>
                <a>
                  <div className={styles.greenText} onClick={() => gotoUserDetail(nftCreatorname)}>
                    {getDisplayUserName(nftCreatorname)}
                  </div>
                </a>
              </Link>
            </div>

            {nftOwnerUsername.length > 0 && nftOwnerUsername !== nftCreatorname && (
              <div className="flex gap-1 lg:gap-2">
                <div className={styles.grayText}>Fostered by</div>
                <Link href={`/${nftOwnerUsername}`} passHref>
                  <a>
                    <div className={styles.greenText} onClick={() => gotoUserDetail(nftOwnerUsername)}>
                      {getDisplayUserName(nftOwnerUsername)}
                    </div>
                  </a>
                </Link>
              </div>
            )}
          </div> */}
      </>
    </div>
  )
}

export default NFTCreatorDataSection
