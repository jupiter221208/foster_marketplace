import React, { Fragment } from 'react'
import { copyToClipboard } from 'utils/helpers'
import { useRouter } from 'next/router'

// third party components
import { Menu, Transition } from '@headlessui/react'

// images and icons
import AddProductIcon from 'assets/icons/plus-icon-17x17.svg?component'
import ThreeDotIcon from 'assets/icons/three-dot-icon-20x5.svg?component'
import ShareSmallIcon from 'assets/icons/share-black-menu.svg?component'
import FileCopyIcon from 'assets/icons/file-copy-white.svg?component'
import SettingsIcon from 'assets/icons/setting-icon-17x17.svg?component'

// styles
import styles from './index.module.scss'

interface MenuEditProps {
  newProductURL: any
  merchUrl: any
  isCreatedMerch: boolean
  setOpenShareModal: any
  setCopyLinkSuccess: any
}

const MenuShareMerch = ({
  newProductURL,
  merchUrl,
  isCreatedMerch,
  setOpenShareModal,
  setCopyLinkSuccess,
}: MenuEditProps) => {
  const router = useRouter()
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
                      router.push(newProductURL)
                    }}
                  >
                    <AddProductIcon alt="" />
                    Add Product
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
                  Share Store
                </div>
              )}
            </Menu.Item>

            <Menu.Item>
              {({ active }) => (
                <div
                  className={`${styles.menuItem}`}
                  onClick={() => {
                    copyToClipboard(globalThis.window?.origin + merchUrl.replaceAll(' ', '%20'))
                    setCopyLinkSuccess()
                  }}
                >
                  <FileCopyIcon alt="" />
                  Copy Link
                </div>
              )}
            </Menu.Item>
            {isCreatedMerch && (
              <Menu.Item>
                {({ active }) => (
                  <div
                    className={`${styles.menuItem} mt-[15px]`}
                    onClick={() => {
                      router.push('/merch-logs')
                    }}
                  >
                    <SettingsIcon alt="" />
                    Store Settings
                  </div>
                )}
              </Menu.Item>
            )}
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  )
}

export default MenuShareMerch
