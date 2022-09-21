import React, { useEffect, useState } from 'react'

// components
import SearchSection from '../SearchSection'
import CollectionSection from './CollectionSection'
import TableSections from './TableSection'

// json
import CreatorsList from 'assets/json/stats/creators-list.json'
import PopularCategoryList from 'assets/json/popular-category.json'
import CreatorsCollectionList from 'assets/json/stats/creators-collection-list.json'

// functions
import { stringLengthValidate } from 'utils/strings'

// styles
import styles from './index.module.scss'

const CreatorsSection = props => {
  const { viewport } = props

  const [searchWord, setSearchWord] = useState<any>('')
  const [creatorsList, setCreatorsList] = useState<any[]>([])
  const [allList, setAllList] = useState<any[]>([])
  const [list, setList] = useState<any[]>([])
  useEffect(() => {
    let array: any[] = [...CreatorsList]
    array.map(item => {
      item.category = PopularCategoryList.filter(elem => elem.id === item.categoryID)
    })
    setAllList(array)
    setCreatorsList(array)
    setList(array)
  }, [])

  useEffect(() => {
    if (creatorsList.length !== 0 || stringLengthValidate(searchWord, 2)) {
      const results = creatorsList.filter(elem => {
        return (
          elem.artistName01.toLowerCase().includes(searchWord) ||
          elem.artistName02.toLowerCase().includes(searchWord) ||
          elem.rank.toLowerCase().includes(searchWord)
        )
      })
      setList(results)
    }
  }, [creatorsList, searchWord])

  return (
    <div className={styles.container}>
      <SearchSection
        viewport={viewport}
        searchWord={searchWord}
        setSearchWord={value => setSearchWord(value.toString())}
        list={allList}
        getList={list => setCreatorsList(list)}
      />
      <div className="mt-8 w-full">
        <CollectionSection viewport={viewport} list={CreatorsCollectionList} />
      </div>
      <div>
        <TableSections viewport={viewport} data={list} />
      </div>
    </div>
  )
}

export default CreatorsSection
