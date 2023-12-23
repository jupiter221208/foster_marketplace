import React, { Fragment } from 'react'

// next components
import Image from 'next/image'

// third party components
import { Menu as HMenu, Transition } from '@headlessui/react'

// styles
import styles from './index.module.scss'
import MenuItem from './MenuItem'

const Menu = props => {
  const { label, menuList, onSelect } = props

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
            {menuList.map((item, index) => (
              <MenuItem key={index} item={item} onSelect={onSelect} />
              // <div
              //   key={index}
              //   className={styles.menuItem}
              //   onClick={() => {
              //     onSelect(item)
              //   }}
              // >
              //   <div className="w-10 h-10">
              //     <Image src={item.icon} alt="" width={40} height={40} />
              //   </div>
              //   {item.label}
              // </div>
            ))}
          </div>
        </Transition>
      </HMenu>
    </div>
  )
}

export default Menu
