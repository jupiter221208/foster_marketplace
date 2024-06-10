import React, { Fragment } from 'react'

// third party components
import { Menu, Transition } from '@headlessui/react'

// images and icons
import FileCopyIcon from 'assets/icons/file-copy-medium.svg?component'
import TwitterWhiteIcon from 'assets/icons/twitter-white-new.svg?component'
import WebsiteIcon from 'assets/icons/website-white.svg?component'
import IGWhiteIcon from 'assets/icons/instagram-green-new.svg?component'
import LandIcon from 'assets/icons/land-icon-new.svg?component'
import SolrPlexIcon from 'assets/icons/solrplex-icon-mobile.svg?component'
import LinkIcon from 'assets/icons/link-icon.svg?component'

// styles
import styles from './index.module.scss'

const WalletFilterMenu = props => {
  const { label, data, selectedItem, setSelectedItem } = props
  return (
    <div className={`relative ${styles.removeBlueHighlight}`}>
      <Menu>
        <Menu.Button>
          <div className={styles.btnArea}>
            <div className="flex gap-[7px] lg:gap-[8px] items-center">
              <LinkIcon alt="" />
              {label}
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
                  {data.map((item, index) => (
                    <div key={index} className="flex justify-between gap-[10px] lg:gap-4 z-10 h-[28px] items-center">
                      <div className="w-[24px] flex justify-center">
                        {item.type === 'address' ? (
                          <FileCopyIcon />
                        ) : item.type === 'twitter' ? (
                          <TwitterWhiteIcon />
                        ) : item.type === 'instagram' ? (
                          <IGWhiteIcon />
                        ) : item.type === 'website' ? (
                          <WebsiteIcon />
                        ) : item.type === 'land' ? (
                          <LandIcon />
                        ) : item.type === 'solar' ? (
                          <SolrPlexIcon />
                        ) : (
                          <></>
                        )}
                      </div>
                      <div
                        className={styles.label}
                        onClick={() => {
                          if (item.type === 'address') {
                            // copyClipboardAlert('wallet-address')
                          }
                          setSelectedItem(item)
                        }}
                      >
                        {item.label}
                      </div>

                      {/* <CopyClipboardChip identifier="wallet-address" /> */}
                    </div>
                  ))}
                </div>
              )}
            </Menu.Item>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  )
}

export default WalletFilterMenu
