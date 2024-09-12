import React, { useEffect, useState, useRef, MutableRefObject } from 'react'
// next components

// third party components

// images and icons

// styles
import styles from './index.module.scss'

// solana

const StudioCategoryMenu = props => {
  const { menuLabel, categoryList, handleSelectCategory, icon } = props
  const [label, setLabel] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const menuRef = useRef<HTMLElement | null>(null)
  const itemRef = useRef<HTMLElement | null>(null)

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

  useEffect(() => {
    let names = []
    categoryList.map((item, index) => item.checked && names.push(item.name))
    if (names.length === 0) setLabel('Category')
    else {
      setLabel(names.join().replaceAll(',', ', '))
    }
  }, [categoryList])

  return (
    <div className={`relative ${styles.removeBlueHighlight}`}>
      <div
        ref={itemRef as MutableRefObject<HTMLDivElement>}
        className={styles.btnArea}
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <div className="mb-[3px]">{menuLabel}</div>
        <div>{icon}</div>
      </div>
      {showDropdown && (
        <div ref={menuRef as MutableRefObject<HTMLDivElement>} className={styles.menuArea}>
          <div className={styles.menuItem}>
            <div className="w-full">
              {categoryList.map((item, index) => (
                <div id={`check-label-${index}`} key={index} className="flex justify-between my-[8px]">
                  <label
                    className={`${styles.checkmark}`}
                    onClick={() => {
                      setShowDropdown(false)
                      handleSelectCategory(index)
                    }}
                  >
                    {item.name}
                  </label>
                  <input
                    className={`${styles.checkbox}`}
                    type="checkbox"
                    id={item.id}
                    checked={item.checked}
                    onChange={() => {
                      setShowDropdown(false)
                      handleSelectCategory(index)
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default StudioCategoryMenu
