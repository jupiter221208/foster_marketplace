import React, { useEffect, useState } from 'react'

// components
import Radio from 'components/Radio'
import PriceRange from 'components/Range/PriceRange'
import Checkbox from 'components/Checkbox'

// json
import ArtistVerificationList from 'assets/json/explore/artist-verification.json'
import AvailabilityList from 'assets/json/explore/availability.json'
import DimensionList from 'assets/json/explore/dimension.json'
import MarketList from 'assets/json/explore/market.json'
import MediumList from 'assets/json/explore/medium.json'
import CategoryList from 'assets/json/popular-category.json'

// styles
import styles from './index.module.scss'

const NFTFilter = props => {
  const { selectedAvailability, setSelectedAvailability } = props
  const [selectedVerifyType, setSelectedVerifyType] = useState<any>(ArtistVerificationList[0])
  const [selectedDimension, setSelectedDimension] = useState<any>(DimensionList[0])
  const [selectedMarket, setSelectedMarket] = useState<any>(MarketList[0])
  const [selectedMedium, setSelectedMedium] = useState<any>(MediumList[0])
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
  }

  return (
    <div className={styles.container}>
      <div className={styles.title}>ARTIST VERIFICATION</div>
      <Radio
        data={ArtistVerificationList}
        selected={selectedVerifyType}
        onChange={item => setSelectedVerifyType(item)}
      />
      <div className={`${styles.title} mt-[52px]`}>AVAILABILITY</div>
      <Radio data={AvailabilityList} selected={selectedAvailability} onChange={item => setSelectedAvailability(item)} />
      <div className={`${styles.title} mt-[52px]`}>DIMENSIONS</div>
      <Radio data={DimensionList} selected={selectedDimension} onChange={item => setSelectedDimension(item)} />
      <div className={`${styles.title} mt-[52px]`}>MARKET</div>
      <Radio data={MarketList} selected={selectedMarket} onChange={item => setSelectedMarket(item)} />
      <div className={`${styles.title} mt-[52px]`}>MEDIUM</div>
      <Radio data={MediumList} selected={selectedMedium} onChange={item => setSelectedMedium(item)} />
      <div className={`${styles.title} mt-[52px]`}>PRICE</div>
      <PriceRange />

      <div className={`${styles.title} mt-[52px]`}>CATEGORIES</div>
      {categoryList.length !== 0 && (
        <Checkbox categoryList={categoryList} onChange={index => handleSelectCategory(index)} />
      )}
    </div>
  )
}

export default NFTFilter
