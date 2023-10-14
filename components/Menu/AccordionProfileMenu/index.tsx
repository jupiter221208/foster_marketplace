import React from 'react'

// next components
import Image from 'next/image'
import { useRouter } from 'next/router'
import ReactPlaceholder from 'react-placeholder/lib'
import 'react-placeholder/lib/reactPlaceholder.css'

// third party components
import { useDispatch } from 'react-redux'
import { Disclosure } from '@headlessui/react'

import RightIcon from 'assets/icons/right-icon.svg?component'
import DownIcon from 'assets/icons/down-icon.svg?component'
import DashboardIcon from 'assets/icons/dashboard-icon-menu.svg?component'
import NotificationIcon from 'assets/icons/notification-icon-menu.svg?component'
import NftCategoryIcon from 'assets/icons/dashboard-icon.svg?component'
import NftCollectionIcon from 'assets/icons/collection-icon.svg?component'
import NftArtistIcon from 'assets/icons/artist-icon.svg?component'
import SingleNftIcon from 'assets/icons/single-nft-icon.svg?component'
import CollectionNftIcon from 'assets/icons/large-collection-icon.svg?component'
import SettingsIcon from 'assets/icons/setting-icon.svg?component'
import MerchIcon from 'assets/icons/merch-icon.svg?component'
import AvatarImage from 'assets/images/dashboard-avatar.png'

// styles
import styles from './index.module.scss'

const AccordionProfileMenu = props => {
  const { icon, label, type = '', data, path = '' } = props

  const router = useRouter()
  const dispatch = useDispatch()

  const handleClick = item => {
    dispatch({ type: 'set', openMobileMenu: false })

    if (label === 'Explore') dispatch({ type: 'set', exploreTab: item.id })

    dispatch({ type: 'set', isLoading: true })

    router.push(item.path)
  }

  const handleSoloMenuItemClick = () => {
    if (!data.length && path) {
      dispatch({ type: 'set', openMobileMenu: false })
      router.push(path)
    }
  }

  return (
    <Disclosure>
      {({ open }) => (
        <>
          <Disclosure.Button
            className={open ? styles.openContainer : styles.container}
            onClick={() => handleSoloMenuItemClick()}
          >
            <div className="flex items-center">
              {icon === null || icon === undefined ? (
                <div className="w-[40px] h-[40px] rounded-full overflow-hidden">
                  <ReactPlaceholder showLoadingAnimation={true} type="rect" ready={false} color="#202427">
                    <div className="w-[40px] h-[40px]"></div>
                  </ReactPlaceholder>
                </div>
              ) : icon?.length > 0 ? (
                <Image src={icon} width={40} height={40} className="rounded-full" objectFit="cover" alt="" />
              ) : (
                <Image src={AvatarImage} alt="" width={40} height={40} layout="responsive" objectFit="cover" />
              )}
              <div className={open ? styles.openLabel : styles.label}>{label}</div>
            </div>
            {data.length !== 0 && (open ? <DownIcon /> : <RightIcon />)}
          </Disclosure.Button>
          {data.length !== 0 && (
            <Disclosure.Panel className="px-4 pt-1 pb-1 text-sm text-gray-500">
              {data.map((item, index) => (
                <div key={index} className={styles.menuItem} onClick={() => handleClick(item)}>
                  <div className="w-10 h-10 flex justify-center items-center">
                    {type === 'avatar' && item.id === 0 ? (
                      <div className="w-10 h-10 flex justify-center items-center">
                        <div className={styles.imageArea}>
                          <Image src={icon ?? ''} alt="" width={24} height={24} className="rounded-full" />
                        </div>
                      </div>
                    ) : item.type === 'merch' ? (
                      <div className="px-[1px]">
                        <MerchIcon />
                      </div>
                    ) : item.type === 'dashboard' ? (
                      <div className="px-[10px] py-2">
                        <DashboardIcon />
                      </div>
                    ) : item.type === 'notifications' ? (
                      <div className="px-[10px] py-2">
                        <NotificationIcon />
                      </div>
                    ) : item.type === 'settings' ? (
                      <SettingsIcon />
                    ) : item.type === 'nft_category' ? (
                      <NftCategoryIcon />
                    ) : item.type === 'nft_collection' ? (
                      <NftCollectionIcon />
                    ) : item.type === 'nft_artist' ? (
                      <NftArtistIcon />
                    ) : item.type === 'single_nft' ? (
                      <SingleNftIcon />
                    ) : item.type === 'collection_nft' ? (
                      <CollectionNftIcon />
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

export default AccordionProfileMenu
