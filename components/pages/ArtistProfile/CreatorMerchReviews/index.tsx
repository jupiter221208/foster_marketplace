import React, { useState, useEffect } from 'react'
import MerchBadgeCard from 'components/Card/MerchBadgeCard'

// json

// styles
import styles from './index.module.scss'
import MerchReviewCard from 'components/Card/MerchReviewCard'

const CreatorMerchReviews = () => {
  const [merchList, setMerchList] = useState([])

  useEffect(() => {
    setMerchList([
      {
        title: 'Merch Craftsman',
      },
      {
        title: 'Solana Visionary',
      },
      {
        title: 'Studio God',
      },
    ])
  }, [])

  return (
    <div className="w-full">
      <div>
        {merchList.map((item, index) => (
          <div className="w-full mb-[20px]" key={index}>
            <MerchReviewCard data={item} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default CreatorMerchReviews
