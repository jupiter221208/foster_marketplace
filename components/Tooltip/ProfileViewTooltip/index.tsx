import React, { Fragment } from 'react'

// next componenets
import Image from 'next/image'

// third party components
import { Menu, Transition } from '@headlessui/react'

// styles
import styles from './index.module.scss'
import InfoGreenIcon from 'assets/icons/info-green.svg'

const ProfileViewTooltip = props => {
  return (
    <div className="relative">
      <Menu>
        <Menu.Button>
          <div className="flex justify-between items-center">
            <Image src={InfoGreenIcon} alt="" />
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
          <div className={styles.menuBlur}>
            <div>
              This setting allows you to choose the type of artwork and statistics displayed on your profile page.
            </div>
            <div className="mt-[20px]">
              <span className={styles.tooltipTitle}>Artist View</span> displays your profile as a creator, showcasing
              the artwork and collections created by you.
            </div>
            <div className="mt-[20px]">
              <span className={styles.tooltipTitle}>Collector View</span> displays your profile as a collector,
              showcasing the artwork and collections you've collected.
            </div>
          </div>
        </Transition>
      </Menu>
    </div>
  )
}

export default ProfileViewTooltip
