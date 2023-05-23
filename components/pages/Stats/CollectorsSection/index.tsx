import React, { useEffect, useState } from 'react'

// components
import SearchSection from '../SearchSection'
import CollectionSection from './CollectionSection'
import TableSections from './TableSection'

// json
import CollectorsList from 'assets/json/stats/collectors-list.json'
import PopularCategoryList from 'assets/json/popular-category.json'
import CollectorsCollectionList from 'assets/json/stats/collectors-collection-list.json'

// functions
import { stringLengthValidate } from 'utils/strings'

// styles
import styles from './index.module.scss'

const CollectorsSection = () => {
  const [searchWord, setSearchWord] = useState<any>('')
  const [collectorsList, setCollectorsList] = useState<any[]>([])
  const [allList, setAllList] = useState<any[]>([])
  const [list, setList] = useState<any[]>([])
  useEffect(() => {
    let array: any[] = [...CollectorsList]
    array.map(item => {
      item.category = PopularCategoryList.filter(elem => elem.id === item.categoryID)
    })
    setAllList(array)
    setCollectorsList(array)
    setList(array)
  }, [])

  useEffect(() => {
    if (collectorsList.length !== 0 || stringLengthValidate(searchWord, 2)) {
      const results = collectorsList.filter(elem => {
        return (
          elem.collectorName01.toLowerCase().includes(searchWord) ||
          elem.collectorName02.toLowerCase().includes(searchWord) ||
          elem.rank.toLowerCase().includes(searchWord)
        )
      })
      setList(results)
    }
  }, [collectorsList, searchWord])

  return (
    <div className={styles.container}>
      <div className={styles.title}>Total Purchase Volume</div>

      <div className="w-full mt-[25px]">
        <CollectionSection list={CollectorsCollectionList} />
      </div>
      <SearchSection
        searchWord={searchWord}
        setSearchWord={value => setSearchWord(value.toString())}
        list={allList}
        getList={list => setCollectorsList(list)}
      />
      <div className="mt-[20px]">
        <TableSections data={list} />
      </div>
    </div>
  )
}

export default CollectorsSection
