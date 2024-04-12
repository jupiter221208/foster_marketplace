import React, { useEffect, useState } from 'react'

// components
import Radio from 'components/Radio'
import Checkbox from 'components/Checkbox'

// json
import AvailabilityList from 'assets/json/explore/availability.json'
import MarketList from 'assets/json/explore/market.json'
import MediumList from 'assets/json/explore/medium.json'
import CategoryList from 'assets/json/popular-category.json'

// styles
import styles from './index.module.scss'

const NFTFilter = props => {
  const {
    selectedAvailability,
    setSelectedAvailability,
    selectCategory,
    selectedMedium,
    setSelectedMedium,
    selectedMarket,
    setSelectedMarket,
  } = props

  const [categoryList, setCategoryList] = useState<any[]>([])

  useEffect(() => {
    let array: any[] = []
    CategoryList.map(item => {
      let object: any = item
      object.checked = false
      array.push(object)
    })
    setCategoryList(array)
  }, [])

  const handleSelectCategory = index => {
    let array = [...categoryList]
    array[index].checked = !array[index].checked
    setCategoryList(array)
    selectCategory(array)
  }

  return (
    <div className={styles.container}>
      <div className={`${styles.title}`}>Availability</div>
      <Radio
        data={AvailabilityList}
        gap={10}
        selected={selectedAvailability}
        onChange={item => setSelectedAvailability(item)}
      />
      <div className={`${styles.title} mt-[52px]`}>Market</div>
      <Radio gap={10} data={MarketList} selected={selectedMarket} onChange={item => setSelectedMarket(item)} />
      <div className={`${styles.title} mt-[52px]`}>Medium</div>
      <Radio gap={10} data={MediumList} selected={selectedMedium} onChange={item => setSelectedMedium(item)} />
      <div className={`${styles.title} mt-[52px]`}>Categories</div>
      {categoryList.length !== 0 && (
        <Checkbox categoryList={categoryList} onChange={index => handleSelectCategory(index)} />
      )}
    </div>
  )
}

export default NFTFilter
