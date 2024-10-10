import React, { Fragment } from 'react'
// next components

// third party components
import { Menu, Transition } from '@headlessui/react'

// images and icons
import ArrowDownIcon from 'assets/icons/down-arrow-icon-white.svg?component'

// styles
import styles from './index.module.scss'

const ShipToDropDown = props => {
  const { name, address } = props
  return (
    <div className={`relative ${styles.removeBlueHighlight}`}>
      <Menu>
        <Menu.Button>
          <div className={`flex gap-[10px] items-center cursor-pointer ${styles.infoValue}`}>
            {name}
            <ArrowDownIcon />
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
              <div>
                <div className={styles.name}>{name}</div>
                <div className={styles.address}>{address}</div>
              </div>
            </Menu.Item>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  )
}

export default ShipToDropDown
