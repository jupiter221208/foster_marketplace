import React, { useState } from 'react'

// styles
import styles from './index.module.scss'

const RatingBar = ({ totalStars = 5, onRating }) => {
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)

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
              setRating(ratingValue)
              onRating(ratingValue)
            }}
            style={{ width: '20px', cursor: 'pointer' }}
          />
        )
      })}
    </div>
  )
}

export default RatingBar
