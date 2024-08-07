import React, { useEffect, useState } from 'react'

// components
import NFTActivityInfoSection from 'components/pages/BrowseNFT/MainSection/NFTActivityInfoSection'

// utilies
import { compareDate } from 'utils/helpers'

// resources
import ArrowRightWhiteIcon from 'assets/icons/arrow-right-white-medium.svg?component'
import ArrowDownWhiteIcon from 'assets/icons/arrow-down-white.svg?component'

// styles
import styles from './index.module.scss'

// api
import activityAPI from 'apis/activity'

const NFTHistorySection = props => {
  const { mintAddress } = props
  const [showDetails, setShowDetails] = useState(false)
  const [activityList, setActivityList] = useState([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    activityAPI.getNFTActivity(mintAddress).then(
      response => {
        let dateSorted = response.sort(compareDate)
        setActivityList(dateSorted)
        setIsLoaded(true)
      },
      error => {}
    )
  }, [])

  return (
    <div className="w-full mt-[15px]">
      <div className="w-full flex justify-between" onClick={() => setShowDetails(!showDetails)}>
        <div className={styles.details}>History</div>
        <div>{showDetails ? <ArrowDownWhiteIcon /> : <ArrowRightWhiteIcon />}</div>
      </div>

      {showDetails &&
        (activityList.length > 0 ? (
          <NFTActivityInfoSection activityList={activityList} />
        ) : isLoaded ? (
          <div className={styles.noCategory}>No transaction history detected for this artwork.</div>
        ) : (
          <></>
        ))}

      <div className={styles.descBorder} />
    </div>
  )
}

export default NFTHistorySection
