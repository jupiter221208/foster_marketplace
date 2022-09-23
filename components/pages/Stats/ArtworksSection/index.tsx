import React, { useEffect, useState } from 'react'

// components
import SearchSection from '../SearchSection'
import CollectionSection from './CollectionSection'
import TableSections from './TableSection'

// json
import ArtworksList from 'assets/json/stats/artworks-list.json'
import PopularCategoryList from 'assets/json/popular-category.json'
import ArtworksCollectionList from 'assets/json/stats/artworks-collection-list.json'

// functions
import { stringLengthValidate } from 'utils/strings'

// styles
import styles from './index.module.scss'

const ArtworksSection = () => {
  const [searchWord, setSearchWord] = useState<any>('')
  const [artWorksList, setArtworksList] = useState<any[]>([])
  const [allList, setAllList] = useState<any[]>([])
  const [list, setList] = useState<any[]>([])
  useEffect(() => {
    let array: any = [...ArtworksList]
    array.map(item => {
      item.category = PopularCategoryList.filter(elem => elem.id === item.categoryID)
    })
    setAllList(array)
    setArtworksList(array)
    setList(array)
  }, [])

  useEffect(() => {
    if (artWorksList.length !== 0 || stringLengthValidate(searchWord, 2)) {
      const results = artWorksList.filter(elem => {
        return (
          elem.artworkName01.toLowerCase().includes(searchWord) ||
          elem.artworkName02.toLowerCase().includes(searchWord) ||
          elem.rank.toLowerCase().includes(searchWord)
        )
      })
      setList(results)
    }
  }, [artWorksList, searchWord])

  return (
    <div className={styles.container}>
      <SearchSection
        searchWord={searchWord}
        setSearchWord={value => setSearchWord(value.toString())}
        list={allList}
        getList={list => setArtworksList(list)}
      />
      <div className="mt-8 w-full">
        <CollectionSection list={ArtworksCollectionList} />
      </div>
      <div>
        <TableSections data={list} />
      </div>
    </div>
  )
}

export default ArtworksSection
