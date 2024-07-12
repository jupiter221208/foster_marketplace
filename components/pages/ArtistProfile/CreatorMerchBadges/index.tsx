import React, { useState, useEffect } from 'react'
import MerchBadgeCard from 'components/Card/MerchBadgeCard'

// json
import BadgeList from 'assets/json/merch-logs/badge-list.json'

// styles
import styles from './index.module.scss'
import MerchBadgeNewCard from 'components/Card/MerchBadgeNewCard'

const CreatorMerchBadges = () => {
  const [merchList, setMerchList] = useState(BadgeList)

  const onSelectCard = index => {
    let list = [...merchList]
    list.map(item => {
      item.id === index ? (item.selected = true) : (item.selected = false)
    })
    setMerchList(list)
  }

  return (
    <div className="w-full">
      <div className="hidden md:flex flex-wrap gap-[17px] lg:gap-[28px] justify-around">
        {merchList.map((item, index) => (
          <div key={index}>
            <MerchBadgeNewCard data={item} onSelect={id => onSelectCard(id)} />
          </div>
        ))}
      </div>
      <div className="md:hidden flex flex-wrap justify-around gap-[17px] sm:gap-[15px]">
        {merchList.map((item, index) => (
          <div key={index}>
            <MerchBadgeNewCard data={item} onSelect={id => onSelectCard(id)} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default CreatorMerchBadges
