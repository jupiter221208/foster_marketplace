import React, { useState } from 'react'

import StarFullAsset from 'assets/icons/star-full.svg?component'
import StarEmptyAsset from 'assets/icons/star-empty.svg?component'

// styles
import styles from './index.module.scss'

const RatingBar = ({ totalStars = 5, value = 0, onRating, clickable = true }) => {
  const [rating, setRating] = useState(value)

  return (
    <div className="flex">
      {[...Array(totalStars)].map((star, index) => {
        const ratingValue = index + 1

        return (
          <div
            className="ml-[4px]"
            onClick={() => {
              if (clickable) {
                setRating(ratingValue)
                onRating(ratingValue)
              }
            }}
          >
            {ratingValue <= rating ? <StarFullAsset /> : <StarEmptyAsset className={styles.starEmptyAsset} />}
          </div>
          // <img
          //   key={index}
          //   src={ratingValue <= rating ? '/images/star-full.png' : '/images/star-empty.png'}
          //   alt="star"
          //   className="star"
          //   onClick={() => {
          //     if (clickable) {
          //       setRating(ratingValue)
          //       onRating(ratingValue)
          //     }
          //   }}
          //   style={{ width: '20px', cursor: 'pointer' }}
          // />
        )
      })}
    </div>
  )
}

export default RatingBar
