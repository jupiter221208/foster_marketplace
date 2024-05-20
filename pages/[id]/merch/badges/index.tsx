import React, { useState, useEffect } from 'react'
import MerchBadgeCard from 'components/Card/MerchBadgeCard'

// json

// styles
import styles from './index.module.scss'

const CreatorMerchBadges = () => {
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
      <div className="grid grid-cols-1 sm:grid-cols-12 gap gap-[20px] sm:gap-[20px] lg:gap-[30px] 2xl:gap-[60px]">
        {merchList.map((item, index) => (
          <div className="col-span-1 sm:col-span-6 lg:col-span-4" key={index}>
            <MerchBadgeCard data={item} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default CreatorMerchBadges
