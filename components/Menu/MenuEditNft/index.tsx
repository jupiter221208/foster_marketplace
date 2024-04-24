import React, { Fragment } from 'react'
import { useRouter } from 'next/router'

// next components
import Image from 'next/image'

// third party components
import { Menu, Transition } from '@headlessui/react'
import { useViewport } from 'utils'

// images and icons
import EditMetaIcon from 'assets/icons/edit-meta.svg?component'
import EditStudioIcon from 'assets/icons/edit-studio.svg?component'
import ThreeDotIcon from 'assets/icons/three-dot-icon.svg?component'
import MerchToggleDisabledIcon from 'assets/icons/merch-toggle-disabled.svg?component'
import MerchToggleEnabledIcon from 'assets/icons/merch-toggle-enabled.svg?component'
// styles
import styles from './index.module.scss'

interface MenuSocialShareProps {
  studio: boolean
  metadata: boolean
  merchToggle: boolean
  isCreatedNft: boolean
  setShowNftMeta: any
  setCreateMerchModal: any
  setRemoveMerchModal: any
}

const MenuEditNft = ({
  studio,
  metadata,
  merchToggle,
  isCreatedNft,
  setShowNftMeta,
  setCreateMerchModal,
  setRemoveMerchModal,
}: MenuSocialShareProps) => {
  const router = useRouter()
  const viewport = useViewport()

  return (
    <div className="relative flex items-center">
      <Menu>
        <Menu.Button>
          <div className={`${styles.iconContainer} w-[41px]`}>
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
            <Menu.Item>
              {({ active }) => (
                <div
                  className={`${styles.menuItem} ${metadata ? '' : 'opacity-[80%]'}`}
                  onClick={() => {
                    if (metadata) setShowNftMeta(true)
                  }}
                >
                  <EditMetaIcon alt="" />
                  Edit Metadata
                </div>
              )}
            </Menu.Item>

            <Menu.Item>
              {({ active }) => (
                <div
                  className={`${styles.menuItem} ${studio ? '' : 'opacity-[80%]'} mt-[8px]`}
                  onClick={() => {
                    if (merchToggle) {
                      if (isCreatedNft) setRemoveMerchModal(true)
                    } else if (isCreatedNft) setCreateMerchModal(true)
                  }}
                >
                  {merchToggle ? (
                    <MerchToggleEnabledIcon alt="" />
                  ) : isCreatedNft ? (
                    <MerchToggleDisabledIcon alt="" />
                  ) : (
                    <></>
                  )}
                  {/* <EditStudioIcon alt="" /> */}
                  {merchToggle ? 'Disable Studio' : 'Enable Studio'}
                </div>
              )}
            </Menu.Item>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  )
}

export default MenuEditNft
