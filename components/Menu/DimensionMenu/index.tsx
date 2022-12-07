import React, { Fragment, useState } from 'react'

// next components
import Image from 'next/image'

// third party components
import { Menu, Transition } from '@headlessui/react'

// styles
import styles from './index.module.scss'

const DimensionMenu = props => {
  const { dimensionList, selectedDimension, onSelect } = props

  return (
    <div className="relative flex items-center">
      <Menu>
        <Menu.Button>
          <div className={styles.container} />
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
          <div className={styles.menuBlur}>
            <div className={styles.menuArea}>
              {dimensionList.map((item, index) => (
                <div
                  key={index}
                  className={styles.menuItem}
                  onClick={() => {
                    onSelect(item)
                  }}
                >
                  <div className={selectedDimension.id === item.id ? styles.selectedMenuItem : ''}>{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </Transition>
      </Menu>
    </div>
  )
}
export default DimensionMenu
