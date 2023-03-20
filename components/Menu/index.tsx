import React, { Fragment } from 'react'

// next components
import Image from 'next/image'

// third party components
import { Menu as HMenu, Transition } from '@headlessui/react'

// styles
import styles from './index.module.scss'

const Menu = props => {
  const { label, menuList, onSelect } = props

  return (
    <div className="relative flex items-center">
      <HMenu>
        <HMenu.Button>
          <div className={styles.container}>
            <div className="mr-[9px]">{label}</div>
            <div className="w-3 h-3 flex justify-center items-center mt-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="10.542" height="6.247" viewBox="0 0 10.542 6.247">
                <path
                  id="angle-down-9"
                  d="M17,9.17a1,1,0,0,0-1.41,0L12,12.71,8.46,9.17a1,1,0,1,0-1.41,1.42l4.24,4.24a1,1,0,0,0,1.42,0L17,10.59a1,1,0,0,0,0-1.42Z"
                  transform="translate(-6.754 -8.879)"
                  fill="var(--chevron-up-icon-color)"
                />
              </svg>
            </div>
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
              <div
                key={index}
                className={styles.menuItem}
                onClick={() => {
                  onSelect(item)
                }}
              >
                <div className="w-10 h-10">
                  <Image src={item.icon} alt="" width={40} height={40} />
                </div>
                {item.label}
              </div>
            ))}
          </div>
        </Transition>
      </HMenu>
    </div>
  )
}

export default Menu
