import React, { useEffect, useState } from 'react'

// components
import SearchSection from '../SearchSection'

// json
import ArtworksList from 'assets/json/stats/artworks-list.json'
import PopularCategoryList from 'assets/json/popular-category.json'

// functions
import { stringLengthValidate } from 'utils/strings'

// styles
import styles from './index.module.scss'

const ArtworksSection = props => {
  const { viewport } = props

  const [searchWord, setSearchWord] = useState('')
  const [artWorksList, setArtworksList] = useState([])
  const [allList, setAllList] = useState([])
  const [list, setList] = useState([])
  useEffect(() => {
    let array = [...ArtworksList]
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
      console.log('searchWord', searchWord)
      console.log('results', results)
      setList(results)
    }
  }, [artWorksList, searchWord])

  useEffect(() => {
    console.log('list', list)
  }, [list])

  return (
    <div className={styles.container}>
      <SearchSection
        viewport={viewport}
        searchWord={searchWord}
        setSearchWord={value => setSearchWord(value.toString())}
        list={allList}
        getList={list => setArtworksList(list)}
      />
    </div>
  )
}

export default ArtworksSection
