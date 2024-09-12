import React, { Fragment } from 'react'

// next components

// third party components
import { Menu, Transition } from '@headlessui/react'

// images and icons
import PlusIcon from 'assets/icons/plus-white-icon.svg?component'
import UploadIcon from 'assets/icons/upload-icon.svg?component'
import ImportIcon from 'assets/icons/import-icon.svg?component'
import CrossPlusIcon from 'assets/icons/cross-plus.svg?component'

// styles
import styles from './index.module.scss'

interface MenuSocialShareProps {
  setShowUploadNew: any
  setShowAddToken: any
  setShowImportEA: any
}

const MenuCreateCollection = ({ setShowUploadNew, setShowAddToken, setShowImportEA }: MenuSocialShareProps) => {
  return (
    <div className="relative flex items-center">
      <Menu>
        <Menu.Button>
          <div className={`${styles.iconContainer} w-[35px]`}>
            <PlusIcon alt="" />
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
                <div
                  className={`${styles.menuItem} ${'opacity-[80%]'}`}
                  onClick={() => {
                    setShowUploadNew(true)
                  }}
                >
                  <UploadIcon alt="" />
                  Upload New
                </div>
              )}
            </Menu.Item>

            <Menu.Item>
              {({ active }) => (
                <div
                  className={`${styles.menuItem} ${'opacity-[80%]'} mt-[8px]`}
                  onClick={() => {
                    setShowAddToken(true)
                  }}
                >
                  <CrossPlusIcon alt="" />
                  Add Token IDs
                </div>
              )}
            </Menu.Item>

            <Menu.Item>
              {({ active }) => (
                <div
                  className={`${styles.menuItem} ${'opacity-[80%]'} mt-[8px]`}
                  onClick={() => {
                    setShowImportEA(true)
                  }}
                >
                  <ImportIcon alt="" />
                  Import from EA
                </div>
              )}
            </Menu.Item>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  )
}

export default MenuCreateCollection
