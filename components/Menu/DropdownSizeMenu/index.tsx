import React, { Fragment, useState, useEffect } from 'react'
// next components

// third party components
import { Menu, Transition } from '@headlessui/react'

// images and icons
import DownIcon from 'assets/icons/down-menu-icon.svg?component'

// styles
import styles from './index.module.scss'

// solana
import Radio from 'components/Radio'

const DropdownSizeMenu = props => {
  const { data, selectedItem, setSelectedItem } = props
  return (
    <div className={`relative ${styles.removeBlueHighlight}`}>
      <Menu>
        <Menu.Button>
          <div className={styles.btnArea}>
            {selectedItem.label}
            <DownIcon />
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
                  {data.map((item, index) => (
                    <div key={index} className="flex justify-between gap-4 z-10 ">
                      <div className={styles.label} onClick={() => setSelectedItem(item)}>
                        {item.label}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Menu.Item>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  )
}

export default DropdownSizeMenu
