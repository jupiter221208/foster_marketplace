import React, { useEffect, useState } from 'react'

// components
import Radio from 'components/Radio'
import Checkbox from 'components/Checkbox'

// json
import ArtistVerificationList from 'assets/json/explore/artist-verification.json'
import CategoryList from 'assets/json/popular-category.json'

// styles
import styles from './index.module.scss'
import { useSelector } from 'react-redux'

const CollectionFilter = props => {
  const { selectCategory } = props
  const lightMode = useSelector(state => (state as any).lightMode)
  const [selectedVerifyType, setSelectedVerifyType] = useState<any>(ArtistVerificationList[2])
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
      <div className={`${styles.title} ${lightMode ? styles.lightTitle : ''}`}>ARTIST VERIFICATION</div>
      <Radio
        data={ArtistVerificationList}
        selected={selectedVerifyType}
        onChange={item => setSelectedVerifyType(item)}
      />
      <div className={`${styles.title} ${lightMode ? styles.lightTitle : ''} mt-[52px]`}>CATEGORIES</div>
      {categoryList.length !== 0 && (
        <Checkbox categoryList={categoryList} onChange={index => handleSelectCategory(index)} />
      )}
    </div>
  )
}

export default CollectionFilter
