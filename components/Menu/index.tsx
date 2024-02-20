import React, { Fragment } from 'react'

// next components

// third party components
import { Menu as HMenu, Transition } from '@headlessui/react'

import { useWallet } from '@solana/wallet-adapter-react'

// styles
import styles from './index.module.scss'
import MenuItem from './MenuItem'
import Link from 'next/link'

const Menu = props => {
  const { label, menuList, onSelect } = props
  const { connected } = useWallet()

  return (
    <div className="relative flex items-center">
      <HMenu>
        <HMenu.Button>
          <div className={styles.container}>
            <div className="mr-[9px]">{label}</div>
          </div>
        </HMenu.Button>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <div className={styles.menuArea}>
            {menuList.map((item, index) =>
              connected ? (
                <Link href={`/${item.path}`} passHref>
                  <a>
                    <MenuItem key={index} item={item} onSelect={onSelect} />
                  </a>
                </Link>
              ) : (
                <MenuItem key={index} item={item} onSelect={onSelect} />
              )
            )}
          </div>
        </Transition>
      </HMenu>
    </div>
  )
}

export default Menu
