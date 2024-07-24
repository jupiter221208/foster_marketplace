import React, { useState, useEffect } from 'react'
import MerchBadgeCard from 'components/Card/MerchBadgeCard'

// json

// styles
import styles from './index.module.scss'
import MerchReviewCard from 'components/Card/MerchReviewCard'
import { getReview } from 'apis/merch'

const CreatorMerchReviews = props => {
  const { userId } = props
  const [merchList, setMerchList] = useState([])

  async function getReviewFromAPI() {
    await getReview(userId).then(setMerchList)
  }

  useEffect(() => {
    getReviewFromAPI()
  }, [])

  return (
    <div className="w-full">
      <div>
        {merchList?.map((item, index) => (
          <div className="w-full mb-[20px]" key={index}>
            <MerchReviewCard data={item} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default CreatorMerchReviews
