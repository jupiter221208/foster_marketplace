import React, { Fragment } from 'react'

// third party component
import { Tab as HTab } from '@headlessui/react'

// custom functions
import { useViewport } from 'utils'

// styles
import styles from './index.module.scss'

const Tab = props => {
  const { tabList, onChange } = props
  const viewport = useViewport()

  return (
    <HTab.Group>
      <HTab.List
        className={
          viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? styles.mobileScrollbar : styles.scrollbar
        }
      >
        {tabList.map((item, index) => (
          <HTab as={Fragment} key={index}>
            <button
              className={`${styles.container} ${item.selected ? styles.activeTab : ''}`}
              onClick={() => onChange(item)}
            >
              <div>{item.label}</div>
            </button>
          </HTab>
        ))}
      </HTab.List>
    </HTab.Group>
  )
}

export default Tab
