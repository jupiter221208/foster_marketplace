import React, { Fragment } from 'react'

// third party component
import { Tab as HTab } from '@headlessui/react'

// styles
import styles from './index.module.scss'

const Tab01 = props => {
  const { tabList, onChange } = props

  return (
    <HTab.Group>
      <HTab.List className="flex gap-[30px] lg:gap-[60px]">
        {tabList.map((item, index) => (
          <HTab as={Fragment} key={index}>
            <button
              className={`${styles.container} ${item.selected ? styles.activeTab : ''}`}
              onClick={() => onChange(item)}
            >
              {item.label}
            </button>
          </HTab>
        ))}
      </HTab.List>
    </HTab.Group>
  )
}

export default Tab01
