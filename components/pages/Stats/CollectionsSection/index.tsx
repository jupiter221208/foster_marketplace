import React, { useEffect, useState } from 'react'

// components
import SearchSection from '../SearchSection'
import CollectionSection from './CollectionSection'
import TableSections from './TableSection'

// json
import CollectionsList from 'assets/json/stats/collections-list.json'
import PopularCategoryList from 'assets/json/popular-category.json'
import CollectionsCollectionList from 'assets/json/stats/collections-collection-list.json'

// functions
import { stringLengthValidate } from 'utils/strings'

// styles
import styles from './index.module.scss'

const CollectionsSection = () => {
  const [searchWord, setSearchWord] = useState<any>('')
  const [collectionsList, setCollectionsList] = useState<any[]>([])
  const [allList, setAllList] = useState<any[]>([])
  const [list, setList] = useState<any[]>([])
  useEffect(() => {
    let array: any[] = [...CollectionsList]
    array.map(item => {
      item.category = PopularCategoryList.filter(elem => elem.id === item.categoryID)
    })
    setAllList(array)
    setCollectionsList(array)
    setList(array)
  }, [])

  useEffect(() => {
    if (collectionsList.length !== 0 || stringLengthValidate(searchWord, 2)) {
      const results = collectionsList.filter(elem => {
        return (
          elem.collectionName01.toLowerCase().includes(searchWord) ||
          elem.collectionName02.toLowerCase().includes(searchWord) ||
          elem.rank.toLowerCase().includes(searchWord)
        )
      })
      setList(results)
    }
  }, [collectionsList, searchWord])

  return (
    <div className={styles.container}>
      <SearchSection
        searchWord={searchWord}
        setSearchWord={value => setSearchWord(value.toString())}
        list={allList}
        getList={list => setCollectionsList(list)}
      />
      <div className="mt-8 w-full">
        <CollectionSection list={CollectionsCollectionList} />
      </div>
      <div>
        <TableSections data={list} />
      </div>
    </div>
  )
}

export default CollectionsSection
