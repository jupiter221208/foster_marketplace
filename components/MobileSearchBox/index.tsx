import React, { useEffect, useState } from 'react'

// third party components
import { useDispatch, useSelector } from 'react-redux'

// custom components
import SearchBox from 'components/Input/SearchBox'

// json
import SearchList from 'assets/json/search-list.json'

// styles
import styles from './index.module.scss'

const MobileSearchBox = () => {
  const openMobileSearchBox = useSelector<any>(state => state.openMobileSearchBox)
  const dispatch = useDispatch()

  const [searchKeyword, setSearchKeyword] = useState<any>('')

  const [searchList, setSearchList] = useState<any>({ nfts: [], artists: [], collections: [] })

  useEffect(() => {
    if (searchKeyword !== '') {
      const getRandom = (arr, n) => {
        var result = new Array(n),
          len = arr.length,
          taken = new Array(len)
        if (n > len) throw new RangeError('getRandom: more elements taken than available')
        while (n--) {
          var x = Math.floor(Math.random() * len)
          result[n] = arr[x in taken ? taken[x] : x]
          taken[x] = --len in taken ? taken[len] : len
        }
        return result
      }

      let object: any = {}
      object.nfts = getRandom(SearchList.nfts, Math.floor(Math.random() * 5))
      object.artists = getRandom(SearchList.artists, Math.floor(Math.random() * 5))
      object.collections = getRandom(SearchList.collections, Math.floor(Math.random() * 5))
      setSearchList(object)
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

  return (
    <div className={styles.menu}>
      <SearchBox
        value={searchKeyword}
        placeholder="Search by NFT, Collection, or Artist"
        onChange={value => setSearchKeyword(value)}
        searchList={searchList}
        onClick={() => handleClear()}
        onClose={() => handleClose()}
      />
    </div>
  )
}

export default MobileSearchBox
