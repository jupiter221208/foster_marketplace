import React, { useState, useEffect } from 'react'
import { compareDate } from 'utils/helpers'
// json

// styles
import MerchReviewCard from 'components/Card/MerchReviewCard'
import { getReview } from 'apis/merch'

const CreatorMerchReviews = props => {
  const { userId } = props
  const [merchList, setMerchList] = useState([])

  async function getReviewFromAPI() {
    getReview(userId).then(
      response => {
        let dateSorted = response.sort(compareDate)
        setMerchList(dateSorted)
      },
      error => {}
    )
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
