import React, { Fragment } from 'react'

// next components
import Image from 'next/image'

// third party components
import { Menu, Transition } from '@headlessui/react'

// images and icons
import CloseIcon from 'assets/icons/close-white-black.svg?component'
import ArrowDownIcon from 'assets/icons/arrow-down-small.svg?component'
import CategoryProductIcon from 'assets/icons/dao-category-product.svg?component'
import CategoryLiftIcon from 'assets/icons/dao-category-lift.svg?component'
import CategoryTreasuryIcon from 'assets/icons/dao-category-treasury.svg?component'
import CategoryCommunityIcon from 'assets/icons/dao-category-community.svg?component'
import CategoryBusinessIcon from 'assets/icons/dao-category-business.svg?component'
import CategoryPartnershipIcon from 'assets/icons/dao-category-partnership.svg?component'

// styles
import styles from './index.module.scss'

const SelectCategoryMenu = props => {
  const { categories, id, name, onClick } = props
  return (
    <div className="relative">
      <Menu>
        <Menu.Button className="w-full">
          <div className="flex justify-between items-center">
            <div className={styles.categoryArea}>
              <div className="flex w-full justify-between items-center mr-[20px]">
                {name === null ? (
                  <div className={styles.noCategory}>Select Category</div>
                ) : (
                  <div className={styles.existingCategory}>
                    {id === 1 ? (
                      <CategoryProductIcon />
                    ) : id === 2 ? (
                      <CategoryLiftIcon />
                    ) : id === 3 ? (
                      <CategoryTreasuryIcon />
                    ) : id === 4 ? (
                      <CategoryCommunityIcon />
                    ) : id === 5 ? (
                      <CategoryBusinessIcon />
                    ) : (
                      <CategoryPartnershipIcon />
                    )}
                    {name}
                  </div>
                )}
                <ArrowDownIcon />
              </div>
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
                  <div className="w-full px-[0px] lg:px-[12px]">
                    {categories?.map((item, index) => (
                      <div key={index} className={styles.text} onClick={() => onClick(index)}>
                        {item.id === 1 ? (
                          <CategoryProductIcon />
                        ) : item.id === 2 ? (
                          <CategoryLiftIcon />
                        ) : item.id === 3 ? (
                          <CategoryTreasuryIcon />
                        ) : item.id === 4 ? (
                          <CategoryCommunityIcon />
                        ) : item.id === 5 ? (
                          <CategoryBusinessIcon />
                        ) : (
                          <CategoryPartnershipIcon />
                        )}
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
