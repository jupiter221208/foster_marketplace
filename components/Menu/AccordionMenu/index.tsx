import React from 'react'

// next components
import Image from 'next/image'
import { useRouter } from 'next/router'

// third party components
import { useDispatch } from 'react-redux'
import { Disclosure } from '@headlessui/react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { useWallet } from '@solana/wallet-adapter-react'

import DashboardIcon from 'assets/icons/dashboard-icon-menu.svg?component'
import EcosystemIcon from 'assets/icons/ecosystem-icon.svg?component'
import NftCategoryIcon from 'assets/icons/dashboard-icon.svg?component'
import NftCollectionIcon from 'assets/icons/collection-icon.svg?component'
import NftArtistIcon from 'assets/icons/artist-icon.svg?component'
import SettingsIcon from 'assets/icons/setting-icon.svg?component'
import CreatorIcon from 'assets/icons/creator-icon.svg?component'
import CollectorIcon from 'assets/icons/collector-icon.svg?component'
import MobileEAIcon from 'assets/icons/create-ea-icon-mobile.svg?component'
import MobileMerchIcon from 'assets/icons/create-merch-icon-mobile.svg?component'
import ArrowRightWhiteIcon from 'assets/icons/arrow-right-white-medium.svg?component'
import ArrowDownWhiteIcon from 'assets/icons/arrow-down-white.svg?component'

// styles
import styles from './index.module.scss'

const AccordionMenu = props => {
  const { icon, openIcon = '', label, type = '', data, path = '', username = '' } = props

  const router = useRouter()
  const dispatch = useDispatch()
  const { setVisible } = useWalletModal()
  const { connected } = useWallet()

  const handleClick = item => {
    dispatch({ type: 'set', openMobileMenu: false })

    if (type === 'explore') {
      if (item.type === 'nft_artist') dispatch({ type: 'set', exploreTab: 0 })
      else if (item.type === 'nft_collection') dispatch({ type: 'set', exploreTab: 1 })
      else if (item.type === 'nft_category') dispatch({ type: 'set', exploreTab: 2 })
    }

    if (type === 'leaderboards') {
      if (item.type === 'stats_artist') dispatch({ type: 'set', activeTab: 0 })
      else if (item.type === 'stats_collections') dispatch({ type: 'set', activeTab: 1 })
      else if (item.type === 'stats_creators') dispatch({ type: 'set', activeTab: 2 })
      else if (item.type === 'stats_collectors') dispatch({ type: 'set', activeTab: 3 })
    }

    if (type === 'create') {
      if (!connected) {
        setVisible(true)
        return
      }
      if (item.type === 'single_nft') dispatch({ type: 'set', createTab: 0 })
      else if (item.type === 'edition') dispatch({ type: 'set', createTab: 1 })
      else if (item.type === 'collection_nft') {
        dispatch({ type: 'set', mintCollectionStep: 1 })
        dispatch({ type: 'set', collectionMintAddress: '' })
        dispatch({ type: 'set', collectionCoverUrl: '' })
        dispatch({ type: 'set', collectionKind: 'foster' })
      } else if (item.type === 'collection_ea') {
        dispatch({ type: 'set', mintCollectionStep: 1 })
        dispatch({ type: 'set', collectionMintAddress: '' })
        dispatch({ type: 'set', collectionCoverUrl: '' })
        dispatch({ type: 'set', collectionKind: 'ea' })
      } else if (item.type == 'studio') {
        router.push(`/${username.replaceAll(' ', '%20')}/merch/new`)
        return
      }
    }

    router.push(item.path)
  }

  const handleSoloMenuItemClick = () => {
    if (!data.length && path) {
      if (path === 'connectWallet') {
        setVisible(true)
      } else {
        dispatch({ type: 'set', openMobileMenu: false })
        router.push(path)
      }
    }
  }
  return (
    <Disclosure>
      {({ open }) => (
        <>
          <Disclosure.Button
            className={`${styles.container} ${open ? '' : styles.bottomBorder}`}
            onClick={() => handleSoloMenuItemClick()}
          >
            <div className="flex items-center">
              {/* {type === 'avatar' ? (
                <Image src={icon} width={40} height={40} className="rounded-full" objectFit="cover" alt="" />
              ) : type === 'explore' ? (
                <ExploreIcon />
              ) : type === 'create' ? (
                <PlusIcon />
              ) : type === 'leaderboards' ? (
                <LeaderboardsIcon />
              ) : type === 'dashboard' ? (
                <DashboardIcon />
              ) : type === 'stats' ? (
                <StatsIcon />
              ) : type === 'dao' ? (
                <DAOIcon />
              ) : type === 'studio' ? (
                <StudioIcon />
              ) : type === 'resources' ? (
                <ResourceIcon />
              ) : (
                <Image src={open ? openIcon : icon} alt="" />
              )} */}
              <div className={styles.label}>{label}</div>
            </div>
            {data.length > 0 && (open ? <ArrowDownWhiteIcon /> : <ArrowRightWhiteIcon />)}
          </Disclosure.Button>
          {data.length > 0 && (
            <Disclosure.Panel className={`w-full -mt-[6px] pb-2 text-sm text-gray-500 ${styles.bottomBorder}`}>
              {data.map((item, index) => (
                <div key={index} className={styles.menuItem} onClick={() => handleClick(item)}>
                  <div className="w-[24px] h-[36px] flex justify-start items-center">
                    {type === 'avatar' && item.id === 0 ? (
                      <div className="w-10 h-10 flex justify-center items-center">
                        <div className={styles.imageArea}>
                          <Image src={icon} alt="" width={24} height={24} className="rounded-full" />
                        </div>
                      </div>
                    ) : item.type === 'merch' ? (
                      <MobileMerchIcon />
                    ) : item.type === 'dashboard' ? (
                      <div className="">
                        <DashboardIcon />
                      </div>
                    ) : item.type === 'settings' ? (
                      <SettingsIcon />
                    ) : item.type === 'nft_category' ? (
                      <EcosystemIcon />
                    ) : item.type === 'nft_collection' || item.type === 'stats_collections' ? (
                      <NftCollectionIcon />
                    ) : item.type === 'nft_artist' || item.type === 'stats_artwork' ? (
                      <NftArtistIcon />
                    ) : item.type === 'single_nft' ? (
                      <NftArtistIcon />
                    ) : item.type === 'edition' ? (
                      <NftCollectionIcon />
                    ) : item.type === 'collection_nft' ? (
                      <NftCategoryIcon />
                    ) : item.type === 'collection_ea' ? (
                      <MobileEAIcon />
                    ) : item.type === 'studio' ? (
                      <MobileMerchIcon />
                    ) : item.type === 'stats_creators' ? (
                      <CreatorIcon />
                    ) : item.type === 'stats_collectors' ? (
                      <CollectorIcon />
                    ) : (
                      <div className="w-10 h-10">
                        <Image src={item.icon} alt="" width={40} height={40} />
                      </div>
                    )}
                  </div>
                  {item.label}
                </div>
              ))}
            </Disclosure.Panel>
          )}
        </>
      )}
    </Disclosure>
  )
}

export default AccordionMenu
