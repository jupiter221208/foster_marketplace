import React from 'react'

// next components
import Image from 'next/image'
import { useRouter } from 'next/router'

// third party components
import { useDispatch } from 'react-redux'
import { Disclosure } from '@headlessui/react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'

import RightIcon from 'assets/icons/right-icon.svg?component'
import DownIcon from 'assets/icons/down-icon.svg?component'

// styles
import styles from './index.module.scss'

const AccordionMenu = props => {
  const { icon, openIcon = '', label, type = '', data, path = '' } = props

  const { connected } = useWallet()
  const { setVisible } = useWalletModal()

  const router = useRouter()
  const dispatch = useDispatch()

  const handleClick = item => {
    if (connected) {
      dispatch({ type: 'set', openMobileMenu: false })

      if (label === 'Explore') dispatch({ type: 'set', exploreTab: item.id })

      router.push(item.path)
    } else {
      setVisible(true)
    }
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
              {type === 'avatar' ? (
                <Image src={icon} width={40} height={40} className="rounded-full" objectFit="cover" alt="" />
              ) : (
                <Image src={open ? openIcon : icon} alt="" />
              )}
              <div className={open ? styles.openLabel : styles.label}>{label}</div>
            </div>
            {data.length !== 0 && (open ? <DownIcon /> : <RightIcon />)}
          </Disclosure.Button>
          {data.length !== 0 && (
            <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
              {data.map((item, index) => (
                <div key={index} className={styles.menuItem} onClick={() => handleClick(item)}>
                  {item.id === 0 ? (
                    <div className="w-10 h-10 flex justify-center items-center">
                      <div className={styles.imageArea}>
                        <Image src={icon} alt="" width={24} height={24} className="rounded-full" />
                      </div>
                    </div>
                  ) : (
                    <div className="w-10 h-10">
                      <Image src={item.icon} alt="" width={40} height={40} />
                    </div>
                  )}
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
