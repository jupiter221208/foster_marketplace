import React, { Fragment } from 'react'

// next components
import Image from 'next/image'

// third party components
import { Menu, Transition } from '@headlessui/react'

// images and icons
import CloseIcon from 'assets/icons/close-white.svg'

// styles
import styles from './index.module.scss'

const SelectCategoryMenu = props => {
  const { categories, name, onClick } = props
  return (
    <div className="relative">
      <Menu>
        <Menu.Button className="w-full">
          <div className="flex justify-between items-center">
            <div className={styles.categoryArea}>
              <div className="flex">
                {name === null ? (
                  <div className={styles.noCategory}>Select Category</div>
                ) : (
                  <div className={styles.existingCategory}> {name}</div>
                )}
              </div>
              {name !== null && (
                <div className="mr-[10px] flex item-center">
                  <Image src={CloseIcon} alt="" onClick={() => onClick(-1)} />
                </div>
              )}
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
                    {categories?.map((item, index) => (
                      <div key={index} className={styles.text} onClick={() => onClick(index)}>
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

export default SelectCategoryMenu
