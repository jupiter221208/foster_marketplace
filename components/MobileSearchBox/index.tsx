import React, { useEffect, useState } from 'react'

// third party components
import { useDispatch, useSelector } from 'react-redux'

// custom components
import SearchBox from 'components/Input/SearchBox'

// json
import SearchList from 'assets/json/search-list.json'

// styles
import styles from './index.module.scss'

// apis
import searchAPI from 'apis/search'

const MobileSearchBox = () => {
  const openMobileSearchBox = useSelector<any>(state => state.openMobileSearchBox)
  const dispatch = useDispatch()

  const [searchKeyword, setSearchKeyword] = useState<any>('')

  const [searchList, setSearchList] = useState<any>({ nfts: [], artists: [], collections: [] })
  const [searchData, setSearchData] = useState<any>({ nfts: [], artists: [], collections: [] })

  let timer = null

  useEffect(() => {
    if (searchKeyword !== '') {
      if (timer) {
        clearTimeout(timer)
        timer = null
      }
      timer = setTimeout(() => {
        searchAPI.search(searchKeyword).then(
          response => {
            let object: any = {}
            object.nfts = response.nfts
            object.artists = response.artists
            object.collections = response.collections
            setSearchList(object)
          },
          error => {
            console.log(error)
          }
        )
      }, 500)
    } else {
      setSearchList({ nfts: [], artists: [], collections: [] })
    }
  }, [searchKeyword])

  const handleClear = () => {
    setSearchKeyword('')
  }

  const handleClose = () => {
    dispatch({ type: 'set', openMobileSearchBox: !openMobileSearchBox })
    setSearchList({ nfts: [], artists: [], collections: [] })
  }

  useEffect(() => {
    if (searchKeyword.length > 0) {
      setSearchData(searchList)
    } else {
      setSearchData({ nfts: [], artists: [], collections: [] })
    }
  }, [searchList])

  return (
    <div className={styles.menu}>
      <SearchBox
        value={searchKeyword}
        placeholder="Search by NFT, Collection, or Artist"
        onChange={value => setSearchKeyword(value)}
        searchList={searchData}
        onClick={() => handleClear()}
        onClose={() => handleClose()}
      />
    </div>
  )
}

export default MobileSearchBox
