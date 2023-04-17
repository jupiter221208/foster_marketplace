import React, { Fragment, useMemo, useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/router'
import { FacebookShareButton, TwitterShareButton, TelegramShareButton } from 'react-share'
// next components
import Image from 'next/image'

// third party components
import { Menu, Transition } from '@headlessui/react'
import { useViewport } from 'utils'

// images and icons
import FileCopyIcon from 'assets/icons/copy-alt-white-32x32.svg?component'
import TwitterUnfilledWhiteIcon from 'assets/icons/twitter-unfilled-white-32x32.svg?component'
import FacebookWhiteIcon from 'assets/icons/facebook-white-32x32.svg?component'
import TelegramWhiteIcon from 'assets/icons/telegram-white-32x32.svg?component'
import ThreeEllipseIcon from 'assets/icons/three-ellipse-white.svg'
import ThreeEllipseMobileIcon from 'assets/icons/three-ellipse-white-mobile.svg'
import ShareBlackIcon from 'assets/icons/share-black-mobile.svg?component'
import ShareBlackDesktopIcon from 'assets/icons/share-black-desktop.svg?component'

// styles
import styles from './index.module.scss'

// call apis
import nftsAPI from 'apis/nfts'
import { copyToClipboard } from 'utils/helpers'

interface MenuSocialShareProps {
  type?: 'icon' | 'ellipse' | 'image'
  icon01?: string
  icon02?: string
  vote: boolean
  voteCount?: number
  setVote?: (boolean) => any
  setVoteCount?: (number) => any
  message: string
  url: string
}

const MenuSocialShare = ({
  type = 'icon',
  icon01,
  icon02,
  vote,
  voteCount,
  setVote,
  setVoteCount,
  message,
  url,
}: MenuSocialShareProps) => {
  const router = useRouter()
  const { id } = router.query
  const viewport = useViewport()

  const fullUrl = globalThis.window?.origin + url

  function shareNFTSocial(type) {
    nftsAPI.shareNft(type, id).then(
      response => {
        if (response !== null) {
          setVoteCount && setVoteCount(voteCount + 1)
          setVote && setVote(true)
        }
      },
      error => {
        console.log(error)
      }
    )
  }
  return (
    <div className="relative flex items-center">
      <Menu>
        <Menu.Button>
          <div className="flex justify-between items-center">
            {type === 'ellipse' ? (
              <div className={styles.ellipseArea}>
                {viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? (
                  <Image src={ThreeEllipseMobileIcon} alt="" width="15px" height="4px" />
                ) : (
                  <Image src={ThreeEllipseIcon} alt="" width="23px" height="6px" />
                )}
              </div>
            ) : type === 'image' ? (
              <div>
                {viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? (
                  <ShareBlackIcon />
                ) : (
                  <ShareBlackDesktopIcon />
                )}
              </div>
            ) : (
              <div className="mt-[4px]">
                <Image src={vote ? icon02 : icon01} alt="" />
              </div>
            )}
            {/* <div className={styles.text}>{voteCount}</div> */}
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
                <div className={styles.menuItem} onClick={() => copyToClipboard(fullUrl)}>
                  {/* <Image src={FileCopyIcon} alt="" /> */}
                  <FileCopyIcon alt="" />
                  Copy to Clipboard
                </div>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <TwitterShareButton
                  title={message}
                  url={fullUrl}
                  beforeOnClick={() => {}}
                  onShareWindowClose={() => {
                    shareNFTSocial('twitter')
                  }}
                  className="w-full"
                >
                  <div className={styles.menuItem}>
                    {/* <Image src={TwitterUnfilledWhiteIcon} alt="" /> */}
                    <TwitterUnfilledWhiteIcon alt="" />
                    Share on Twitter
                  </div>
                </TwitterShareButton>
              )}
            </Menu.Item>

            <Menu.Item>
              {({ active }) => (
                <FacebookShareButton
                  quote={message}
                  url={fullUrl}
                  beforeOnClick={() => {}}
                  onShareWindowClose={() => {
                    shareNFTSocial('facebook')
                  }}
                  className="w-full"
                >
                  <div className={styles.menuItem}>
                    {/* <Image src={FacebookWhiteIcon} alt="" /> */}
                    <FacebookWhiteIcon alt="" />
                    Share on Facebook
                  </div>
                </FacebookShareButton>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <TelegramShareButton
                  title={message}
                  url={fullUrl}
                  beforeOnClick={() => {}}
                  onShareWindowClose={() => {
                    shareNFTSocial('telegram')
                  }}
                  className="w-full"
                >
                  <div className={styles.menuItem}>
                    {/* <Image src={TelegramWhiteIcon} alt="" /> */}
                    <TelegramWhiteIcon alt="" />
                    Share on Telegram
                  </div>
                </TelegramShareButton>
              )}
            </Menu.Item>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  )
}

export default MenuSocialShare
