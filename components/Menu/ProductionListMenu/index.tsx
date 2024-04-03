import React, { Fragment } from 'react'
// next components

// third party components
import { Menu, Transition } from '@headlessui/react'

// images and icons
import DownIcon from 'assets/icons/down-icon-small.svg?component'

// styles
import styles from './index.module.scss'

// solana
import ProductMenuItem from './ProductMenuItem'

const ProductionListMenu = props => {
  const { label, data, selectedItem, setSelectedItem } = props
  return (
    <div className={`relative ${styles.removeBlueHighlight}`}>
      <Menu>
        <Menu.Button>
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
                  <ProductMenuItem
                    data={data}
                    selected={selectedItem}
                    direction=""
                    onChange={item => setSelectedItem(item)}
                  />
                </div>
              )}
            </Menu.Item>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  )
}

export default ProductionListMenu
