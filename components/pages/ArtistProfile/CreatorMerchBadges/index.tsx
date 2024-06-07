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
        id: 0,
        type: 'merch',
        title: 'Merch Manlet',
        selected: true,
        list: [
          {
            label: 'Add a merch item to your store',
            total: 2,
            value: 1,
          },
          {
            label: 'Sell a limited edition merch item',
            total: 1,
            value: 1,
          },
          {
            label: 'Make 3 sales',
            total: 3,
            value: 3,
          },
          {
            label: 'Share a link to your merch store on X',
            total: 1,
            value: 1,
          },
        ],
      },
      {
        id: 1,
        type: 'studio',
        title: 'Studio Shipoooor',
        selected: false,
        list: [
          {
            label: 'Make a sale to 10 unique buyers',
            total: 10,
            value: 5,
          },
          {
            label: 'Sell out a merch edition listing in 24 hrs',
            total: 1,
            value: 0,
          },
          {
            label: 'Generate $1,000 in merch sales',
            total: 1000,
            value: 330,
          },
          {
            label: 'Accumulate 10 five-star reviews',
            total: 10,
            value: 0,
          },
        ],
      },
      {
        id: 2,
        type: 'fashion',
        title: 'Fashion Chad',
        selected: false,
        list: [
          {
            label: 'Achieve 100+ sales',
            total: 100,
            value: 0,
          },
          {
            label: 'Accumulate 20 five-star reviews',
            total: 20,
            value: 0,
          },
          {
            label: 'Purchase merch from ten creators',
            total: 10,
            value: 0,
          },
          {
            label: 'Tweet your Studio success story on X',
            total: 1,
            value: 0,
          },
        ],
      },
    ])
  }, [])

  const onSelectCard = index => {
    let list = [...merchList]
    list.map(item => {
      item.id === index ? (item.selected = true) : (item.selected = false)
    })
    setMerchList(list)
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-12 gap gap-[20px] sm:gap-[20px] lg:gap-[30px] 2xl:gap-[60px]">
        {merchList.map((item, index) => (
          <div className="col-span-1 sm:col-span-6 lg:col-span-4" key={index}>
            <MerchBadgeCard data={item} onSelect={id => onSelectCard(id)} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default CreatorMerchBadges
