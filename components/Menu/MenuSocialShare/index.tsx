import React, { Fragment } from 'react'

// next components
import Image from 'next/image'

// third party components
import { Menu, Transition } from '@headlessui/react'

// images and icons
import FileCopyIcon from 'assets/icons/copy-alt-white-32x32.svg'
import TwitterUnfilledWhiteIcon from 'assets/icons/twitter-unfilled-white-32x32.svg'
import FacebookWhiteIcon from 'assets/icons/facebook-white-32x32.svg'
import TelegramWhiteIcon from 'assets/icons/telegram-white-32x32.svg'

// styles
import styles from './index.module.scss'

const MenuSocialShare = props => {
  const { icon01, icon02, vote, voteCount, onClick } = props
  return (
    <div className="relative">
      <Menu>
        <Menu.Button>
          <div className="flex justify-between items-center">
            <Image src={vote ? icon02 : icon01} alt="" />
            <div className={styles.text}>{voteCount}</div>
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
                <div className={styles.menuItem} onClick={() => onClick()}>
                  <Image src={FileCopyIcon} alt="" />
                  Copy to Clipboard
                </div>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <div className={styles.menuItem} onClick={() => onClick()}>
                  <Image src={TwitterUnfilledWhiteIcon} alt="" />
                  Share on Twitter
                </div>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <div className={styles.menuItem} onClick={() => onClick()}>
                  <Image src={FacebookWhiteIcon} alt="" />
                  Share on Facebook
                </div>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <div className={styles.menuItem} onClick={() => onClick()}>
                  <Image src={TelegramWhiteIcon} alt="" />
                  Share on Telegram
                </div>
              )}
            </Menu.Item>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  )
}

export default MenuSocialShare
