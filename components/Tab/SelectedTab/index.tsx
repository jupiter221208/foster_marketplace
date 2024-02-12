import React, { Fragment } from 'react'

// third party component
import { Tab as HTab } from '@headlessui/react'

// styles
import styles from './index.module.scss'
import TabItem from './TabItem'

const Tab01 = props => {
  const { tabList, onChange, type = 'image' } = props
  return (
    <HTab.Group>
      <HTab.List className="flex">
        {tabList.map((item, index) => (
          <HTab as={Fragment} key={index}>
            <TabItem item={item} onChange={onChange} type={type} />
          </HTab>
        ))}
      </HTab.List>
    </HTab.Group>
  )
}

export default Tab01
