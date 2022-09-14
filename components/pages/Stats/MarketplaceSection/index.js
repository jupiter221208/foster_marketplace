import React, { useEffect, useState } from 'react'

// components
import SearchSection from '../SearchSection'
import CollectionSection from './CollectionSection'
import TableSections from './TableSection'

// json
import MarketplacesList from 'assets/json/stats/marketplace-list.json'
import PopularCategoryList from 'assets/json/popular-category.json'

// functions
import { stringLengthValidate } from 'utils/strings'

// styles
import styles from './index.module.scss'

const MarketplaceSection = props => {
  const { viewport } = props

  const [searchWord, setSearchWord] = useState('')
  const [marketplacesList, setMarketplacesList] = useState([])
  const [categoryList, setCategoryList] = useState([])
  const [allList, setAllList] = useState([])
  const [list, setList] = useState([])
  useEffect(() => {
    let array = [...MarketplacesList]
    array.map(item => {
      item.category = PopularCategoryList.filter(elem => elem.id === item.categoryID)
    })
    setAllList(array)
    setMarketplacesList(array)
    setList(array)
    setCategoryList([PopularCategoryList[6], PopularCategoryList[2], PopularCategoryList[4]])
  }, [])

  useEffect(() => {
    if (marketplacesList.length !== 0 || stringLengthValidate(searchWord, 2)) {
      const results = marketplacesList.filter(elem => {
        if (elem.category.length > 0) {
          return elem.category[0].name.toLowerCase().includes(searchWord)
        } else return false
      })
      setList(results)
    }
  }, [marketplacesList, searchWord])

  return (
    <div className={styles.container}>
      <SearchSection
        viewport={viewport}
        searchWord={searchWord}
        setSearchWord={value => setSearchWord(value)}
        list={allList}
        getList={list => setMarketplacesList(list)}
      />
      <div className="mt-8 w-full">
        <CollectionSection viewport={viewport} list={categoryList} />
      </div>
      <div>
        <TableSections viewport={viewport} data={list} />
      </div>
    </div>
  )
}

export default MarketplaceSection
