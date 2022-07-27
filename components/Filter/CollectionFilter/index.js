import React, { useEffect, useState } from 'react'

// components
import Radio from 'components/Radio'
import Checkbox from 'components/Checkbox'

// json
import ArtistVerificationList from 'assets/json/explore/artist-verification.json'
import CategoryList from 'assets/json/category-list.json'

// styles
import styles from './index.module.scss'

const CollectionFilter = props => {
  const [selectedVerifyType, setSelectedVerifyType] = useState(ArtistVerificationList[0])
  const [categoryList, setCategoryList] = useState([])

  useEffect(() => {
    let array = []
    CategoryList.map(item => {
      let object = item
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
      <div className={`${styles.title} mt-[52px]`}>CATEGORIES</div>
      {categoryList.length !== 0 && (
        <Checkbox categoryList={categoryList} onChange={index => handleSelectCategory(index)} />
      )}
    </div>
  )
}

export default CollectionFilter
