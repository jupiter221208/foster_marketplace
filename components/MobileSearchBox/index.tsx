import React, { useEffect, useState } from 'react'

// third party components
import { useDispatch, useSelector } from 'react-redux'

// custom components
import SearchBox from 'components/Input/SearchBox'

// json

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

  const handleClose = () => {
    dispatch({ type: 'set', openMobileSearchBox: !openMobileSearchBox })
  }

  return (
    <div className={styles.menu}>
      <SearchBox onCloseSearch={() => handleClose()} />
    </div>
  )
}

export default MobileSearchBox
