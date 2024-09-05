import React, { useEffect, useState } from 'react'

import StarFullAsset from 'assets/icons/star-full.svg?component'
import StarGreenAsset from 'assets/icons/star-full-green.svg?component'
import StarEmptyAsset from 'assets/icons/star-empty.svg?component'

// styles
import styles from './index.module.scss'

const RatingBar = ({ totalStars = 5, value = 0, onRating, clickable = true, greenMode = false }) => {
  const [rating, setRating] = useState(value)

  useEffect(() => {
    setRating(value)
  }, [value])

  return (
    <div className="flex">
      {[...Array(totalStars)].map((star, index) => {
        const ratingValue = index + 1

        return (
          <div
            key={index}
            className="ml-[4px]"
            onClick={() => {
              if (clickable) {
                setRating(ratingValue)
                onRating(ratingValue)
              }
            }}
          >
            {ratingValue <= rating ? greenMode ? <StarGreenAsset /> : <StarFullAsset /> : <StarEmptyAsset />}
          </div>
        )
      })}
    </div>
  )
}

export default RatingBar
