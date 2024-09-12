import React from 'react'

// third party components
import { useDispatch, useSelector } from 'react-redux'

// custom components
import SearchBox from 'components/Input/SearchBox'

// json

// styles
import styles from './index.module.scss'

const MobileSearchBox = () => {
  const openMobileSearchBox = useSelector<any>(state => state.openMobileSearchBox)
  const dispatch = useDispatch()

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
