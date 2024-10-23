import React, { MutableRefObject, useRef, useEffect, useState } from 'react'

// images and icons
import DownIcon from 'assets/icons/down-icon-small.svg?component'

// styles
import styles from './index.module.scss'
import CheckboxGroup from 'components/Checkbox/CheckboxGroup'

// solana

const SizeSelectionMenu = props => {
  const { categoryList, handleSelectCategory, handleSelectAll, type } = props
  const [label, setLabel] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const [isSelectedAll, setIsSelectedAll] = useState(false)
  const menuRef = useRef<HTMLElement | null>(null)
  const itemRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    let names = []
    categoryList.map((item, index) => item.checked && names.push(item.name))
    if (names.length === 0) setLabel('Select the sizes available for purchase')
    else {
      setLabel(names.join().replaceAll(',', ', '))
    }
    let count = 0
    categoryList.map(item => {
      if (item.checked === true) count++
    })
    if (categoryList.length === count) setIsSelectedAll(true)
    else setIsSelectedAll(false)
  }, [categoryList])

  const handleClickOutside = event => {
    if (
      menuRef.current &&
      !menuRef.current.contains(event.target) &&
      itemRef.current &&
      !itemRef.current.contains(event.target)
    ) {
      setShowDropdown(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  })

  return (
    <div className={`relative ${styles.removeBlueHighlight}`}>
      <div
        className={styles.btnArea}
        ref={itemRef as MutableRefObject<HTMLDivElement>}
        onClick={() => setShowDropdown(!showDropdown)}
      >
        {label}
        <div>
          <DownIcon alt="" />
        </div>
      </div>
      {showDropdown && (
        <div ref={menuRef as MutableRefObject<HTMLDivElement>} className={styles.menuArea}>
          <div className={styles.menuItem}>
            <div className={styles.selectAll} onClick={() => handleSelectAll(!isSelectedAll)}>
              {isSelectedAll ? 'Deselect All' : 'Select All'}
            </div>
            <CheckboxGroup type={type} categoryList={categoryList} onChange={index => handleSelectCategory(index)} />
          </div>
        </div>
      )}
    </div>
  )
}

export default SizeSelectionMenu
