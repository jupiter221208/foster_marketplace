import React, { Fragment } from 'react'

// next components
import Image from 'next/image'

// third party components
import { Menu, Transition } from '@headlessui/react'

// images and icons
import ExistingCollectionIcon from 'assets/icons/existing-collection-green.svg'

// styles
import styles from './index.module.scss'

const SelectCollectionMenu = props => {
  const { collections, onClick } = props
  return (
    <div className="relative">
      <Menu>
        <Menu.Button className="w-full">
          <div className="flex justify-between items-center py-2">
            <div className={styles.collectionArea}>
              <div>
                <Image src={ExistingCollectionIcon} alt="" />
              </div>
              <div className={styles.existingCollection}>Select an existing collection</div>
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
          <Menu.Items className={styles.menuBlur}>
            <div className={styles.menuArea}>
              <Menu.Item>
                {({ active }) => (
                  <div>
                    {collections?.map((item, index) => (
                      <div className={styles.text} onClick={() => onClick(index)}>
                        {item.name}
                      </div>
                    ))}
                  </div>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  )
}

export default SelectCollectionMenu
