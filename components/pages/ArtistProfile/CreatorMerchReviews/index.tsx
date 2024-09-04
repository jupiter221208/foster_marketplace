import React, { useState, useEffect } from 'react'
import { compareDate } from 'utils/helpers'

import MerchReviewCard from 'components/Card/MerchReviewCard'
import { getReview } from 'apis/merch'

// styles
import styles from './index.module.scss'

const CreatorMerchReviews = props => {
  const { userId } = props
  const [merchList, setMerchList] = useState([])
  const [loaded, setLoaded] = useState(false)

  async function getReviewFromAPI() {
    getReview(userId).then(
      response => {
        let dateSorted = response.sort(compareDate)
        setMerchList(dateSorted)
        setLoaded(true)
      },
      error => {
        setLoaded(true)
      }
    )
  }

  useEffect(() => {
    getReviewFromAPI()
  }, [])

  return (
    <div className="w-full">
      <div>
        {merchList?.length > 0 ? (
          merchList?.map((item, index) => (
            <div className="w-full mb-[20px]" key={index}>
              <MerchReviewCard data={item} />
            </div>
          ))
        ) : loaded ? (
          <div className="w-full flex justify-center pt-[100px]">
            <div className={styles.noReview}>No reviews yet.</div>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  )
}

export default CreatorMerchReviews
