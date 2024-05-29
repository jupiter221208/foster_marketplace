import React, { useState } from 'react'

// styles
import styles from './index.module.scss'

const RatingBar = ({ totalStars = 5, value = 0, onRating, clickable = true }) => {
  const [rating, setRating] = useState(value)

  return (
    <div className="flex">
      {[...Array(totalStars)].map((star, index) => {
        const ratingValue = index + 1

        return (
          <img
            key={index}
            src={ratingValue <= rating ? '/images/star-full.png' : '/images/star-empty.png'}
            alt="star"
            className="star"
            onClick={() => {
              if (clickable) {
                setRating(ratingValue)
                onRating(ratingValue)
              }
            }}
            style={{ width: '20px', cursor: 'pointer' }}
          />
        )
      })}
    </div>
  )
}

export default RatingBar
