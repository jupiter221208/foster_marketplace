import React, { Fragment } from 'react'
import { copyToClipboard } from 'utils/helpers'

// third party components
import { Menu, Transition } from '@headlessui/react'

// images and icons
import EditMetaIcon from 'assets/icons/edit-meta.svg?component'
import ThreeDotIcon from 'assets/icons/three-dot-icon.svg?component'
import ShareSmallIcon from 'assets/icons/share-black-menu.svg?component'
import FileCopyIcon from 'assets/icons/file-copy-white.svg?component'

// styles
import styles from './index.module.scss'

interface MenuEditProps {
  explorerURL: any
  isCreatedMerch: boolean
  setShowEditMerch: any
  setOpenShareModal: any
}

const MenuEditMerch = ({ explorerURL, isCreatedMerch, setShowEditMerch, setOpenShareModal }: MenuEditProps) => {
  return (
    <div className="relative flex items-center">
      <Menu>
        <Menu.Button>
          <div className={`${styles.iconContainer} w-[32px]`}>
            <ThreeDotIcon alt="" />
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
            {isCreatedMerch && (
              <Menu.Item>
                {({ active }) => (
                  <div
                    className={`${styles.menuItem} mb-[15px]`}
                    onClick={() => {
                      setShowEditMerch(true)
                    }}
                  >
                    <EditMetaIcon alt="" />
                    Edit details
                  </div>
                )}
              </Menu.Item>
            )}

            <Menu.Item>
              {({ active }) => (
                <div
                  className={`${styles.menuItem} mb-[15px]`}
                  onClick={() => {
                    setOpenShareModal(true)
                  }}
                >
                  <ShareSmallIcon alt="" />
                  Share product
                </div>
              )}
            </Menu.Item>

            <Menu.Item>
              {({ active }) => (
                <div
                  className={`${styles.menuItem}`}
                  onClick={() => {
                    copyToClipboard(globalThis.window?.origin + explorerURL.replaceAll(' ', '%20'))
                  }}
                >
                  <FileCopyIcon alt="" />
                  Copy link
                </div>
              )}
            </Menu.Item>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  )
}

export default MenuEditMerch
