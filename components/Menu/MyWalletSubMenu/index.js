import React from 'react'

// next components
import Image from 'next/image'
import { useRouter } from 'next/router'

// third party components
import { useDispatch } from 'react-redux'
import { Disclosure } from '@headlessui/react'
import { ChevronRightIcon } from '@heroicons/react/solid'

// images
import ChangeWalletIcon from 'assets/icons/change-wallet.svg'
import DisconnectWalletIcon from 'assets/icons/disconnect-wallet.svg'
import MenuWalletIcon from 'assets/icons/menu-wallet-icon.svg'

// styles
import styles from './index.module.scss'

const MyWalletSubMenu = props => {
  const { icon, label, type = '', data, path = '' } = props
  const router = useRouter()
  const dispatch = useDispatch()

  const handleClick = item => {
    dispatch({ type: 'set', exploreTab: item.id })
    dispatch({ type: 'set', openMobileMenu: false })
    router.push(item.path)
  }

  return (
    <Disclosure>
      {({ open }) => (
        <>
          <Disclosure.Button className={styles.container}>
            <div className="flex items-center">
              {type === 'avatar' ? (
                <Image src={icon} width={40} height={40} className="rounded-full" objectFit="cover" alt="" />
              ) : (
                <Image src={icon} alt="" />
              )}
              <div className={styles.label}>{label}</div>
            </div>
            {data.length !== 0 && (
              <ChevronRightIcon
                className={`${open ? 'rotate-90 transform' : ''} h-6 w-6`}
                style={{ color: '#5AC3BA' }}
              />
            )}
          </Disclosure.Button>

          <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
            <div className={styles.menuItem}>
              <Image src={ChangeWalletIcon} alt="" width={50} height={50} />
              <div>Change Wallet</div>
            </div>
            <div className={styles.menuItem}>
              <Image src={DisconnectWalletIcon} alt="" width={50} height={50} />
              <div>Disconnect Wallet</div>
            </div>
            <div className={styles.menuItem}>
              <div className="pl-[14px] pr-[10px] pt-[8px]">
                <Image src={MenuWalletIcon} alt="" width={20} height={22} />
              </div>

              <div className={styles.walletAddress}>G2t2k..ff4m</div>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}

export default MyWalletSubMenu
