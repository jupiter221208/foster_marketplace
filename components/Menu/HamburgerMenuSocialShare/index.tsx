import React, { Fragment, useMemo } from 'react'
import { useRouter } from 'next/router'
import { FacebookShareButton, TwitterShareButton, TelegramShareButton } from 'react-share'
// next components
import Image from 'next/image'

// third party components
import { Menu, Transition } from '@headlessui/react'

// images and icons
import HamburgerMenuIcon from 'assets/icons/hamburger-menu-dot-white.svg'
import FileCopyIcon from 'assets/icons/copy-alt-white-32x32.svg'
import TwitterUnfilledWhiteIcon from 'assets/icons/twitter-unfilled-white-32x32.svg'
import FacebookWhiteIcon from 'assets/icons/facebook-white-32x32.svg'
import TelegramWhiteIcon from 'assets/icons/telegram-white-32x32.svg'

// styles
import styles from './index.module.scss'

// call apis
import nftsAPI from 'apis/nfts'

// solana
import { getExplorerUrl } from 'utils/explorer'
import { useConnection } from '@solana/wallet-adapter-react'
import { copyToClipboard } from 'utils/helpers'

const HamburgerMenuSocialShare = props => {
  const { address, icon01, icon02, vote, voteCount, setVote, setVoteCount, onClick } = props
  const router = useRouter()
  const { id } = router.query
  const { connection } = useConnection()
  const explorerURL = useMemo(() => getExplorerUrl(connection.rpcEndpoint, address), [address, connection])

  function shareNFTSocial(type) {
    nftsAPI.shareNft(type, id).then(
      response => {
        if (response !== null) {
          setVoteCount(voteCount + 1)
          setVote(true)
        }
      },
      error => {
        console.log(error)
      }
    )
  }
  return (
    <div className="relative mt-[4px]">
      <Menu>
        <Menu.Button>
          <div className="w-7 h-7 flex justify-center items-center">
            <Image src={HamburgerMenuIcon} alt="" />
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
                <div className={styles.menuItem} onClick={() => copyToClipboard(address)}>
                  <Image src={FileCopyIcon} alt="" />
                  Copy to Clipboard
                </div>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <TwitterShareButton
                  title={'Share foster NFT'}
                  url={`${window?.origin}/nft/${id}`}
                  beforeOnClick={() => {}}
                  onShareWindowClose={() => {
                    shareNFTSocial('twitter')
                  }}
                  className="w-full"
                >
                  <div className={styles.menuItem}>
                    <Image src={TwitterUnfilledWhiteIcon} alt="" />
                    Share on Twitter
                  </div>
                </TwitterShareButton>
              )}
            </Menu.Item>

            <Menu.Item>
              {({ active }) => (
                <FacebookShareButton
                  url={explorerURL}
                  quote={'Share foster NFT'}
                  beforeOnClick={() => {}}
                  onShareWindowClose={() => {
                    shareNFTSocial('facebook')
                  }}
                  className="w-full"
                >
                  <div className={styles.menuItem}>
                    <Image src={FacebookWhiteIcon} alt="" />
                    Share on Facebook
                  </div>
                </FacebookShareButton>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <TelegramShareButton
                  url={explorerURL}
                  title={'Share foster NFT'}
                  beforeOnClick={() => {}}
                  onShareWindowClose={() => {
                    shareNFTSocial('telegram')
                  }}
                  className="w-full"
                >
                  <div className={styles.menuItem}>
                    <Image src={TelegramWhiteIcon} alt="" />
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

export default HamburgerMenuSocialShare
