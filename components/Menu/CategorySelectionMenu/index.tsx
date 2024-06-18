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
      <Menu>
        <Menu.Button className="w-full">
          <div className={styles.btnArea}>
            {label}
            <div>
              <DownIcon alt="" />
            </div>
          </div>
        </Menu.Button>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className={styles.menuArea}>
            <Menu.Item>
              {({ active }) => (
                <div className={styles.menuItem}>
                  <CheckboxGroup categoryList={categoryList} onChange={index => handleSelectCategory(index)} />
                </div>
              )}
            </Menu.Item>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  )
}

export default CategorySelectionMenu
