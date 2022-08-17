import React, { Fragment } from 'react'

// next components
import Image from 'next/image'

// third party component
import { Tab as HTab } from '@headlessui/react'

// styles
import styles from './index.module.scss'

const IconTab = props => {
  const { tabList, onChange } = props

  return (
    <HTab.Group>
      <HTab.List className="flex flex-wrap justify-center items-center z-10">
        {tabList.map((item, index) => (
          <HTab as={Fragment} key={index}>
            <button
              className={`${styles.container} ${item.selected ? styles.activeTab : ''}`}
              onClick={() => onChange(item)}
            >
              <div className="w-full h-full min-w-[20px] min-h-[20px] max-w-[20px] max-h-[20px]">
                <Image
                  src={item.selected ? item.icon01 : item.icon02}
                  alt=""
                  width={20}
                  height={20}
                  objectFit="cover"
                />
              </div>
              <div className="ml-3">{item.label}</div>
            </button>
          </HTab>
        ))}
      </HTab.List>
    </HTab.Group>
  )
}

export default IconTab
