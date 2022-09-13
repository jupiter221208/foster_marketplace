import React, { useEffect, useState } from 'react'

// components
import StatsSearchBox from 'components/Input/StatsSearchBox'
import GradientButton from 'components/Button/GradientButton'

// styles
import styles from './index.module.scss'

const SearchSection = props => {
  const { viewport, searchWord, setSearchWord, list, getList } = props
  // const [searchWord, setSearchWord] = useState('')

  const [searchList, setSearchList] = useState(list)

  const [active, setActive] = useState(3)

  useEffect(() => {
    setSearchList(list)
  }, [])

  const handleChangeActive = value => {
    setActive(value)

    switch (value) {
      case 0:
        setSearchList(list.slice(0, 5))
        break
      case 1:
        setSearchList(list.slice(0, 10))
        break
      case 2:
        setSearchList(list.slice(0, 15))
        break
      default:
        setSearchList(list)
        break
    }
  }

  useEffect(() => {
    getList(searchList)
  }, [searchList])

  return (
    <div className={styles.container}>
      <div className="w-full flex justify-between">
        <StatsSearchBox
          value={searchWord}
          placeholder="Search by artwork name"
          onChange={value => setSearchWord(value)}
        />
        <div className="flex justify-between gap-[50px]">
          <GradientButton
            label="24 hrs"
            onClick={() => handleChangeActive(0)}
            color={active === 0 ? '#202427' : '#979EA2'}
            backgroundColor01={active === 0 ? '#5ac3ba' : 'transparent'}
            backgroundColor02={active === 0 ? '#2D625D' : 'transparent'}
            gradientDirection="bottom"
          />
          <GradientButton
            label="7 days"
            onClick={() => handleChangeActive(1)}
            color={active === 1 ? '#202427' : '#979EA2'}
            backgroundColor01={active === 1 ? '#5ac3ba' : 'transparent'}
            backgroundColor02={active === 1 ? '#2D625D' : 'transparent'}
            gradientDirection="bottom"
          />
          <GradientButton
            label="30 days"
            onClick={() => handleChangeActive(2)}
            color={active === 2 ? '#202427' : '#979EA2'}
            backgroundColor01={active === 2 ? '#5ac3ba' : 'transparent'}
            backgroundColor02={active === 2 ? '#2D625D' : 'transparent'}
            gradientDirection="bottom"
          />
          <GradientButton
            label="All Time"
            onClick={() => handleChangeActive(3)}
            color={active === 3 ? '#202427' : '#979EA2'}
            backgroundColor01={active === 3 ? '#5ac3ba' : 'transparent'}
            backgroundColor02={active === 3 ? '#2D625D' : 'transparent'}
            gradientDirection="bottom"
          />
        </div>
      </div>
    </div>
  )
}

export default SearchSection
