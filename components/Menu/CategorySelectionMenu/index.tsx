import React, { Fragment, useEffect, useState } from 'react'
// next components

// third party components
import { Menu, Transition } from '@headlessui/react'

// images and icons
import DownIcon from 'assets/icons/down-icon-small.svg?component'

// styles
import styles from './index.module.scss'
import CheckboxGroup from 'components/Checkbox/CheckboxGroup'

// solana

const CategorySelectionMenu = props => {
  const { categoryList, handleSelectCategory } = props
  const [label, setLabel] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)

  useEffect(() => {
    let names = []
    categoryList.map((item, index) => item.checked && names.push(item.name))
    if (names.length === 0) setLabel('Select up to three categories')
    else {
      setLabel(names.join().replaceAll(',', ', '))
    }
  }, [categoryList])

  return (
    <div className={`relative ${styles.removeBlueHighlight}`}>
      <div className={styles.btnArea} onClick={() => setShowDropdown(!showDropdown)}>
        {label}
        <div>
          <DownIcon alt="" />
        </div>
      </div>
      {showDropdown && (
        <div className={styles.menuArea}>
          <div className={styles.menuItem}>
            <CheckboxGroup categoryList={categoryList} onChange={index => handleSelectCategory(index)} />
          </div>
        </div>
      )}
    </div>
  )
}

export default CategorySelectionMenu
