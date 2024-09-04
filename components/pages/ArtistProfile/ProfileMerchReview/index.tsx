import React, { useState, useEffect } from 'react'
import { compareDate } from 'utils/helpers'

import { getReview } from 'apis/merch'

// json

// styles
import styles from './index.module.scss'
import RatingBar from 'components/RatingBar'
import MerchReviewModal from 'components/Menu/MerchReviewModal'

const ProfileMerchReview = props => {
  const { userId, username } = props
  const [reviewList, setReviewList] = useState([])
  const [rating, setRating] = useState(0)
  const [count, setCount] = useState(0)
  const [openReviewModal, setOpenReviewModal] = useState(false)

  async function getReviewFromAPI(userId) {
    getReview(userId).then(
      response => {
        if (response?.length > 0) {
          let dateSorted = response.sort(compareDate)
          setReviewList(dateSorted)
          setCount(dateSorted.length)
          let totalRating = 0
          dateSorted.map(item => (totalRating += item.rating))
          setRating(totalRating / dateSorted.length)
        }
      },
      error => {}
    )
  }

  useEffect(() => {
    if (userId !== null && userId !== undefined) getReviewFromAPI(userId)
  }, [userId])

  return (
    <div>
      <div className="flex gap-[12px] items-center">
        <RatingBar value={rating} onRating={() => {}} clickable={false} />
        <div className={styles.count} onClick={() => setOpenReviewModal(true)}>
          ({count})
        </div>
      </div>
      {openReviewModal && (
        <MerchReviewModal
          open={openReviewModal}
          close={() => setOpenReviewModal(false)}
          merchList={reviewList}
          username={username}
        />
      )}
    </div>
  )
}

export default ProfileMerchReview
