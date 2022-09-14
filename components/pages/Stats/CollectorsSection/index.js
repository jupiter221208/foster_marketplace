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

const CollectorsSection = props => {
  const { viewport } = props

  const [searchWord, setSearchWord] = useState('')
  const [collectorsList, setCollectorsList] = useState([])
  const [allList, setAllList] = useState([])
  const [list, setList] = useState([])
  useEffect(() => {
    let array = [...CollectorsList]
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
      <SearchSection
        viewport={viewport}
        searchWord={searchWord}
        setSearchWord={value => setSearchWord(value.toString())}
        list={allList}
        getList={list => setCollectorsList(list)}
      />
      <div className="mt-8 w-full">
        <CollectionSection viewport={viewport} list={CollectorsCollectionList} />
      </div>
      <div>
        <TableSections viewport={viewport} data={list} />
      </div>
    </div>
  )
}

export default CollectorsSection
